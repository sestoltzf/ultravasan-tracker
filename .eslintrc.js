module.exports = {
    extends: ["next", "next/core-web-vitals", "eslint:recommended"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { vars: "all", args: "none", ignoreRestSiblings: true },
      ],
    },
  };
  