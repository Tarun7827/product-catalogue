import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabseServerClient } from "@/lib/supabse/server-client";

export async function POST(req: Request) {
  console.log("Webhook received");
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "Missing signature" },
        { status: 400 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Signature:", signature);
    if (signature !== expectedSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }
    console.log("Signature verified");
    const event = JSON.parse(body);
    console.log("Event:", event);
    if (event.event == "payment.captured") {
      console.log("Payment captured");
      const supabase = await createSupabseServerClient();
      const orderIdRaw = event.payload.payment.entity.notes.supabase_order_id;
      console.log("Order ID:", orderIdRaw);
      console.log("Order ID type:", typeof orderIdRaw);
      if (!orderIdRaw) {
        console.error("No order ID in payment notes");
        return NextResponse.json(
          { message: "Order ID not found" },
          { status: 400 },
        );
      }

      // Update the order status in the "orders" table instead of inserting a row into "payments"
      // You can also upsert into payments, but typically you want to update the order
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
        })
        .eq("id", orderIdRaw);

      // Prefer to use the error from the update first, then from payments insert
      if (error) {
        console.log("❌ DB error:", error);
      } else {
        console.log("✅ Order updated.");
      }

      // Optionally insert (or upsert) a row into payments for tracking
      const { error: paymentError } = await supabase.from("payments").insert({
        order_id: orderIdRaw,
        payment_provider: "Razorpay",
        payment_id: event.payload.payment.entity.id,
        amount: event.payload.payment.entity.amount,
        status: event.payload.payment.entity.status,
      });

      if (paymentError) {
        console.error("Failed to update payment:", paymentError);
        return NextResponse.json(
          { message: "Failed to update payment" },
          { status: 500 },
        );
      }
    }
    console.log("Payment successful");
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
