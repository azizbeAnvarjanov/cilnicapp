import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";
import allowedIps from "./app/allowedIps"; // Tasdiqlangan IP ro'yxati
import axios from "axios";
export default withAuth({
  loginPage: "/api/auth/login",
  isReturnToCurrentPage: true,
  postLoginRedirectUrl: "/",
});

export const config = {
  matcher: ["/dashboard"],
};

export async function middleware(request) {
  try {
    // IP olish uchun tashqi xizmatni chaqirish
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const userIp = ipResponse.data.ip;

    // Tasdiqlangan IP-manzillar ro'yxatida bor yoki yo'qligini tekshirish
    if (!allowedIps.includes(userIp)) {
      // Agar IP ruxsat etilmagan bo'lsa, foydalanuvchini boshqa sahifaga yo'naltirish
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    // Agar IP tasdiqlangan bo'lsa, davom etadi
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware IP tekshirishda xatolik:", error);
    // Xatolik yuz berganda foydalanuvchini boshqa sahifaga yo'naltirish
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
