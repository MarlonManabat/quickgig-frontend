export async function testLogin(page, role: "worker" | "employer" = "worker") {
  await page.request.get(`/api/__test/login?role=${role}`, {
    headers: { "x-test-secret": process.env.TEST_LOGIN_SECRET! },
  });
}
