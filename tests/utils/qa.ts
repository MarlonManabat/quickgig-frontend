import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

export async function qaPost(
  request: APIRequestContext,
  path: string,
  data?: unknown,
) {
  const resp = await request.post(path, { data });
  const text = await resp.text();

  let json: any = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(
        `QA POST ${path} -> ${resp.status()} ${resp.statusText()}\nBody: ${text.slice(
          0,
          300,
        )}`,
      );
    }
  }

  expect(
    resp.ok(),
    `QA POST ${path} failed: ${resp.status()} ${text}`,
  ).toBeTruthy();
  return json;
}

