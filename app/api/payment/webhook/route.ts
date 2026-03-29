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
    if (event.event === "payment.captured") {
      console.log("Payment captured");
      const supabase = await createSupabseServerClient();
      const orderId = event.payload.payment.entity.notes.supabase_order_id;
      console.log("Order ID:", orderId);
      console.log("Event:", event);
      if (!orderId) {
        console.error("No order ID in payment notes");
        return NextResponse.json(
          { message: "Order ID not found" },
          { status: 400 },
        );
      }

      const { data: payment, error } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          payment_provider: "Razorpay",
          payment_id: event.payload.payment.entity.id,
          amount: event.payload.payment.entity.amount,
          status: "paid",
        })
        .select()
        .single();

      if (error) {
        console.log("❌ DB error:", error);
      } else {
        console.log("✅ Order updated. payment", payment);
      }

      if (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json(
          { message: "Failed to update order" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
