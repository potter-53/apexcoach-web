import assert from "node:assert/strict";
import test from "node:test";

import { createClaimToken, hashClaimToken, verifyClaimToken } from "../src/lib/stripe-claim-token.js";

test("creates a claim token with a matching SHA-256 hash", () => {
  const claim = createClaimToken();

  assert.ok(claim.token.length >= 32);
  assert.match(claim.hash, /^[a-f0-9]{64}$/);
  assert.equal(claim.hash, hashClaimToken(claim.token));
  assert.equal(verifyClaimToken(claim.hash, claim.token), true);
});

test("rejects a different token and malformed hashes", () => {
  const claim = createClaimToken();

  assert.equal(verifyClaimToken(claim.hash, `${claim.token}x`), false);
  assert.equal(verifyClaimToken("invalid", claim.token), false);
  assert.equal(verifyClaimToken("", claim.token), false);
});

test("creates unique claim tokens", () => {
  const first = createClaimToken();
  const second = createClaimToken();

  assert.notEqual(first.token, second.token);
  assert.notEqual(first.hash, second.hash);
});
