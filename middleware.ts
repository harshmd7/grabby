import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/api/user/signin", "/api/user/signup"];

export async function middleware(request: NextRequest) {
	if (publicRoutes.includes(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const authorization = request.headers.get("authorization");
	const token = authorization?.startsWith("Bearer ")
		? authorization.substring(7)
		: null;
	const secret = process.env.JWT_SECRET;

	if (!token || !secret) {
		return NextResponse.json(
			{ message: "Authentication token is required" },
			{ status: 401 },
		);
	}

	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(secret),
		);
		if (typeof payload.userId !== "string") {
			return NextResponse.json(
				{ message: "Invalid token" },
				{ status: 401 },
			);
		}

		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-user-id", payload.userId);

		return NextResponse.next({
			request: { headers: requestHeaders },
		});
	} catch {
		return NextResponse.json(
			{ message: "Invalid or expired token" },
			{ status: 401 },
		);
	}
}

export const config = {
	matcher: ["/api/user/:path*", "/api/order/:path*"],
};
