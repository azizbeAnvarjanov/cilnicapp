import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
export default withAuth({
  loginPage: "/api/auth/login",
  isReturnToCurrentPage: true,
  postLoginRedirectUrl: "/",
});

export const config = {
  matcher: ["/dashboard"],
};

import { NextResponse } from "next/server";

export async function middleware(request) {
  const userIp =
    request.headers.get("x-forwarded-for") || request.ip || "127.0.0.1";
  console.log("User IP:", userIp);

  const allowedIps = ["127.0.0.1", "84.54.72.83"];
  if (!allowedIps.includes(userIp)) {
    console.log("Access Denied for IP:", userIp); // Nima sababdan rad etilganligini bilish uchun
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  console.log("Access Granted for IP:", userIp);
  return NextResponse.next();
}
