import { test, expect } from "@playwright/test";
import { reAuthAware } from "./_helpers";

test.describe("reAuthAware regex guard", () => {
  test("accepts /post-jobs and /login?next= flow (with optional query/hash)", () => {
    const re = reAuthAware("/post-jobs");
    expect("/post-jobs").toMatch(re);
    expect("/post-jobs?utm=x").toMatch(re);
    expect("/post-jobs#top").toMatch(re);
    expect("/login?next=%2Fpost-jobs").toMatch(re);
    expect("/login?next=%2Fpost-jobs&utm=x").toMatch(re);
  });

  test("accepts /applications variants", () => {
    const re = reAuthAware("/applications");
    expect("/applications").toMatch(re);
    expect("/login?next=%2Fapplications").toMatch(re);
  });

  test("rejects wrong target", () => {
    const re = reAuthAware("/post-jobs");
    expect("/browse-jobs").not.toMatch(re);
  });
});
