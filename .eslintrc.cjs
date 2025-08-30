module.exports = {
  extends: "./.eslintrc.json",
  rules: {
    // Prefer array-form for insert/upsert to keep TS happy with Supabase types
    "no-restricted-syntax": [
      "warn",
      {
        selector: "CallExpression[callee.property.name='insert'] > ObjectExpression",
        message: "Use array-form: .insert([{ ... }]) to keep Supabase types sound.",
      },
    ],
  },
};
