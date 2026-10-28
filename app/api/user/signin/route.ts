import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 },
            );
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return NextResponse.json(
                { message: "JWT_SECRET is not configured" },
                { status: 500 },
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 },
            );
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            secret,
            { expiresIn: "10d" },
        );

        return NextResponse.json({ message: "Signin successful", token });
    } catch {
        return NextResponse.json(
            { message: "Unable to sign in" },
            { status: 500 },
        );
    }
}