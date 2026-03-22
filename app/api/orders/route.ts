import { NextResponse } from "next/server";
import { createSupabseServerClient } from "@/lib/supabse/server-client";
import { CartItem } from "@/types/CartItem";

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
