/**
 * Manual integration test script for the auth flow.
 * Run with: npx tsx scripts/test-auth.ts
 *
 * Requires the dev server running on NEXT_PUBLIC_APP_URL (default: http://localhost:3000).
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── helpers ────────────────────────────────────────────────────────────────

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function ok(label: string, condition: boolean) {
  if (condition) {
    process.stdout.write(`  ✓ ${label}\n`);
  } else {
    process.stderr.write(`  ✗ ${label}\n`);
    process.exitCode = 1;
  }
}

// ─── tests ──────────────────────────────────────────────────────────────────

async function testRegister() {
  process.stdout.write("\n[register]\n");

  const email = `test+${Date.now()}@example.com`;

  const { status, data } = await post("/api/auth/register", {
    email,
    password: "TestPass123!",
    name: "Test User",
  });
  ok("201 on valid registration", status === 201);
  ok("returns success flag", data.success === true);

  // Duplicate email
  const dup = await post("/api/auth/register", {
    email,
    password: "TestPass123!",
    name: "Test User",
  });
  ok("409 on duplicate email", dup.status === 409);

  return email;
}

async function testLogin(email: string) {
  process.stdout.write("\n[login]\n");

  const { status, data } = await post("/api/auth/login", {
    email,
    password: "TestPass123!",
  });
  // Email is not verified yet — expect 403
  ok("403 when email unverified", status === 403);
  ok("returns error message", typeof data.error === "string");

  // Wrong password
  const wrong = await post("/api/auth/login", {
    email,
    password: "WrongPass999!",
  });
  ok("401 on wrong password", wrong.status === 401 || wrong.status === 403);
}

async function testForgotPassword(email: string) {
  process.stdout.write("\n[forgot-password]\n");

  // Known email
  const { status, data } = await post("/api/auth/forgot-password", { email });
  ok("200 on known email", status === 200);
  ok("returns success flag", data.success === true);

  // Unknown email — must also return 200 (no user enumeration)
  const unknown = await post("/api/auth/forgot-password", {
    email: "nobody@nowhere.invalid",
  });
  ok("200 on unknown email (no enumeration)", unknown.status === 200);
  ok("returns success flag for unknown email", unknown.data.success === true);
}

async function testResetPasswordBadToken() {
  process.stdout.write("\n[reset-password — bad token]\n");

  const { status, data } = await post("/api/auth/reset-password", {
    token: "000000000000000000000000000000000000000000000000000000000000000",
    password: "NewPass456!",
  });
  ok("400 on invalid token", status === 400);
  ok("returns error message", typeof data.error === "string");
}

async function testResetPasswordValidation() {
  process.stdout.write("\n[reset-password — input validation]\n");

  // Missing token
  const { status: s1 } = await post("/api/auth/reset-password", {
    password: "NewPass456!",
  });
  ok("400 when token missing", s1 === 400);

  // Password too short
  const { status: s2 } = await post("/api/auth/reset-password", {
    token: "abc",
    password: "short",
  });
  ok("400 when password < 8 chars", s2 === 400);
}

async function testRateLimit() {
  process.stdout.write("\n[rate-limit — forgot-password]\n");

  // Fire 6 rapid requests; at least one should be 429
  const results = await Promise.all(
    Array.from({ length: 6 }, () =>
      post("/api/auth/forgot-password", { email: "rl@example.com" })
    )
  );
  const statuses = results.map((r) => r.status);
  ok(
    "429 received after burst (rate-limit active)",
    statuses.includes(429)
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

(async () => {
  process.stdout.write(`\nRunning auth tests against ${BASE_URL}\n`);
  process.stdout.write("=".repeat(50) + "\n");

  try {
    const email = await testRegister();
    await testLogin(email);
    await testForgotPassword(email);
    await testResetPasswordBadToken();
    await testResetPasswordValidation();
    await testRateLimit();
  } catch (err) {
    process.stderr.write(`\nUnhandled error: ${err}\n`);
    process.exitCode = 1;
  }

  process.stdout.write("\n" + "=".repeat(50) + "\n");
  if (process.exitCode === 1) {
    process.stderr.write("Some tests FAILED.\n");
  } else {
    process.stdout.write("All tests passed.\n");
  }
})();
