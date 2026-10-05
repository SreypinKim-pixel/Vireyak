import { test, expect } from "@playwright/test";
import {
  accountCredentialsSchema,
  registrationSchema,
  loginSchema,
  localAccountsSchema,
  attractionOptionsSchema,
} from "../lib/validation/auth";
import {
  dateSchema,
  travelSearchSchema,
  provinceIdSchema,
} from "../lib/validation/travel";

test("auth schemas preserve credentials and enforce registration boundaries", () => {
  expect(
    loginSchema.parse({ email: " demo@example.com ", password: " password " }),
  ).toEqual({ email: "demo@example.com", password: " password " });
  for (const password of [" ".repeat(12), "a".repeat(11), "a".repeat(129)]) {
    expect(
      accountCredentialsSchema.safeParse({
        email: "test@example.com",
        password,
      }).success,
    ).toBe(false);
  }
  for (const length of [12, 128]) {
    expect(
      accountCredentialsSchema.safeParse({
        email: "test@example.com",
        password: "a".repeat(length),
      }).success,
    ).toBe(true);
  }
  const result = registrationSchema.safeParse({
    name: " ",
    email: "invalid",
    password: "short",
    confirmPassword: "different",
  });
  expect(result.success).toBe(false);
  if (!result.success)
    expect(result.error.issues.map((issue) => issue.path[0])).toEqual([
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);
  expect(
    localAccountsSchema.safeParse([
      { email: "test@example.com", salt: null, hash: "invalid" },
    ]).success,
  ).toBe(false);
  expect(
    attractionOptionsSchema.safeParse({
      data: [{ id: "1", name: "Temple", province: null }],
    }).success,
  ).toBe(false);
});

test("travel schemas validate dates, ranges and province identifiers", () => {
  expect(dateSchema.safeParse("2032-02-29").success).toBe(true);
  expect(dateSchema.safeParse("2030-02-29").success).toBe(false);
  const schema = travelSearchSchema("2030-01-01");
  for (const [checkin, checkout] of [
    ["2030-01-02", ""],
    ["2030-01-03", "2030-01-02"],
    ["2029-12-31", "2030-01-02"],
  ]) {
    expect(schema.safeParse({ tab: "stays", checkin, checkout }).success).toBe(
      false,
    );
  }
  expect(
    schema.safeParse({ tab: "stays", checkin: "", checkout: "" }).success,
  ).toBe(true);
  expect(
    schema.safeParse({
      tab: "attraction",
      checkin: "2030-01-02",
      checkout: "ignored",
    }).success,
  ).toBe(true);
  expect(provinceIdSchema.safeParse("123456").success).toBe(true);
  expect(provinceIdSchema.safeParse("1234567").success).toBe(false);
  expect(provinceIdSchema.safeParse("../1").success).toBe(false);
});
