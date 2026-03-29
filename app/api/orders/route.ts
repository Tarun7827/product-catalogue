import { NextResponse } from "next/server";
import { createSupabseServerClient } from "@/lib/supabse/server-client";
import Razorpay from "razorpay";
import { connectToDatabase } from "@/lib/mongodb";
import { orderItem } from "@/types/Order";
import Product from "@/models/Product";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
  try {
    const supabase = await createSupabseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Unauthorized. Please sign in.");
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { message: "Missing or empty items." },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of body.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 404 }
        );
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product_id: String(product._id),
        quantity: item.quantity,
        price: product.price,
      });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { message: orderError?.message ?? "Failed to create order." },
        { status: 500 }
      );
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.total_amount * 100,
      currency: "USD",
      receipt: `Order_${order.id}`,
      notes: {
        supabase_order_id: order.id,
      }
    });

    const orderItemsWithOrderId = orderItems.map((item) => ({
      order_id: order.id,
      ...item
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsWithOrderId);

    if (orderItemsError) {
      return NextResponse.json(
        { message: orderItemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order,
      razorpay: {
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      }
    }, { status: 201 });
  } catch (err) {
    console.error("Orders API error:", err);
    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const order_items: orderItem[] = [];
  try {
    const supabase = await createSupabseServerClient();
    const { data: { user },  error : authError} = await supabase.auth.getUser();

    if(authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
// console.log("User:", user);
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id);
// console.log("Orders:", orders);
    if(error) {
      return NextResponse.json(
        { message: error.message ?? "Failed to fetch orders." },
        { status: 500 }
      );
    }
// console.log("Orders:", orders);

    for(const order of orders) {
      const { data: orderItems, error: orderItemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      if(orderItemsError) {
        return NextResponse.json(
          { message: orderItemsError.message ?? "Failed to fetch order items." },
          { status: 500 }
        );
      }
      order_items.push(...orderItems);
    }
    // console.log("Order Items:", order_items);
    return NextResponse.json(order_items, { status: 200 });
  } catch (err) {
    console.error("Orders API error:", err);
    return NextResponse.json(
      { message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

