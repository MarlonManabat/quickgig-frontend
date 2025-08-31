import { test as base } from "@playwright/test";

export const workerTest = base;
export const employerTest = base;
export const adminTest = base;

export async function loginAndSaveState(
  role: "worker" | "employer" | "admin",
  baseURL: string,
) {
  // Placeholder for CI login implementation
  return Promise.resolve();
}
