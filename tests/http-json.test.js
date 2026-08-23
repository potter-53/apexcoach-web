import assert from "node:assert/strict";
import test from "node:test";

import { PayloadTooLargeError, readJsonBody } from "../src/lib/http-json.js";

test("parses a JSON request within the byte limit", async () => {
  const request = new Request("https://nlock.pt/api/example", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Coach" }),
  });

  assert.deepEqual(await readJsonBody(request, 128), { name: "Coach" });
});

test("rejects a body whose declared length exceeds the limit", async () => {
  const request = new Request("https://nlock.pt/api/example", {
    method: "POST",
    headers: { "Content-Length": "1000" },
    body: "{}",
  });

  await assert.rejects(readJsonBody(request, 32), PayloadTooLargeError);
});

test("measures the real UTF-8 body when content-length is unavailable", async () => {
  const request = new Request("https://nlock.pt/api/example", {
    method: "POST",
    body: JSON.stringify({ message: "á".repeat(40) }),
  });

  await assert.rejects(readJsonBody(request, 48), PayloadTooLargeError);
});
