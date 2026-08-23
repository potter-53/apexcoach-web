import { Buffer } from "node:buffer";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function hashClaimToken(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

export function createClaimToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashClaimToken(token) };
}

export function verifyClaimToken(expectedHash, token) {
  if (!/^[a-f0-9]{64}$/.test(String(expectedHash || ""))) return false;
  const receivedHash = hashClaimToken(token);
  return timingSafeEqual(
    Buffer.from(expectedHash, "hex"),
    Buffer.from(receivedHash, "hex"),
  );
}
