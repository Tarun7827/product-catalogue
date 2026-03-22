"use server";

import { NextResponse } from "next/server";
import { createSupabseServerClient } from "@/lib/supabse/server-client";
import { CartItem } from "@/types/CartItem";
import { orderItem } from "@/types/Order";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const totalAmount = body.totalAmount ?? body.total_amount;

    if (totalAmount == null || typeof totalAmount !== "number") {
      return NextResponse.json(
        { message: "Missing or invalid totalAmount." },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Orders insert error:", error);
      return NextResponse.json(
        { message: error.message ?? "Failed to create order." },
        { status: 500 }
      );
    }
      console.log(`Items: ${JSON.stringify(body.items)}`);

      // 2️⃣ attach order_id to items
    const items = body.items.map((item: CartItem) => (
      {
        order_id: order.id,
        product_id: item.product._id,
        quantity: item.quantity,
        price: item.product.price
    }))

    // 3️⃣ insert order_items
    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(items)

    if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Orders API error:", err);
    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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

