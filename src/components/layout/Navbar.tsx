import NavbarClient from "./NavbarClient";
import { cookies } from "next/headers";
import crypto from "crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function base64urlDecode(input: string) {
  // replace URL-safe chars
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  // pad with '='
  const pad = input.length % 4;
  if (pad === 2) input += "==";
  else if (pad === 3) input += "=";
  else if (pad === 1) input += "===";
  return Buffer.from(input, "base64").toString("utf8");
}

function verifyJwtHs256(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    const signature = Buffer.from(
      sigB64.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(signingInput)
      .digest();
    if (!crypto.timingSafeEqual(expected, signature)) return false;

    const payloadJson = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);
    if (payload && payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export default async function Navbar() {
  // try {
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get?.("swappio_token")?.value;
  //   if (!token) return <NavbarClient />;
  //   const secret = process.env.NEXT_JWT_SECRET;
  //   if (secret) {
  //     verifyJwtHs256(token, secret);
  //     return <NavbarClient />;
  //   }
  //   // fallback: existing server-side profile fetch when no local secret provided
  //   const res = await fetch(`${API_URL}/auth/profile`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     cache: "no-store",
  //   });
  //   if (!res.ok) return <NavbarClient />;
  //   return <NavbarClient />;
  // } catch {
  //   return <NavbarClient />;
  // }
  return <NavbarClient />;
}
