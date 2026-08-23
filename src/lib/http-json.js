import { Buffer } from "node:buffer";

export class PayloadTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "PayloadTooLargeError";
  }
}

export async function readJsonBody(request, maxBytes = 32 * 1024) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PayloadTooLargeError();
  }

  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    throw new PayloadTooLargeError();
  }

  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
