import dbConnect from "@/lib/dbConnect";
import { Order, Post, User } from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json(
                { message: "Authentication token is required" },
                { status: 401 },
            );
        }

        const { postId, item } = await req.json();
        if (!postId || !item) {
            return NextResponse.json(
                { message: "postId and item are required" },
                { status: 400 },
            );
        }

        await dbConnect();

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 },
            );
        }

        if (post.user.toString() === userId) {
            return NextResponse.json(
                { message: "You cannot place an order on your own post" },
                { status: 400 },
            );
        }

        const order = await Order.create({
            user: userId,
            postUserId: post.user,
            price: post.price,
            item,
        });

        await User.findByIdAndUpdate(userId, {
            $push: { orders: order._id },
        });

        return NextResponse.json(
            { message: "Order placed", order },
            { status: 201 },
        );
    } catch {
        return NextResponse.json(
            { message: "Unable to place order" },
            { status: 500 },
        );
    }
}