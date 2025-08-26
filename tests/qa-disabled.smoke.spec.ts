import { test, expect } from "@playwright/test";
import handler from "../pages/api/qa/tickets/get";

test("QA route returns 404 when disabled", async () => {
  process.env.QA_ENABLED = "false";
  const req: any = { method: "GET", headers: {}, query: {} };
  const res: any = {
    statusCode: 0,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    end() {
      return this;
    },
    json() {
      return this;
    },
  };
  await handler(req, res);
  expect(res.statusCode).toBe(404);
});
