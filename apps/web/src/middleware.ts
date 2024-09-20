import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isProtected = /^\/(site\/.*|dashboard|settings)/.test(req.nextUrl.pathname);

    if (req.nextUrl.pathname.includes("/api/auth/callback/github")) {
        return NextResponse.next();
    }

    if (!isLoggedIn && isProtected) {
        const newUrl = new URL("/", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
