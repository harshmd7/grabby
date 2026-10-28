import dbConnect from "@/lib/dbConnect";
import { Order } from "@/model/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json(
                { message: "Authentication token is required" },
                { status: 401 },
            );
        }

        await dbConnect();
        const orders = await Order.find({ postUserId: userId });

        return NextResponse.json({ orders });
    } catch {
        return NextResponse.json(
            { message: "Unable to fetch orders" },
            { status: 500 },
        );
    }
}