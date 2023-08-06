module.exports = {
  semi: false,
  trailingComma: "all",
  arrowParens: "always",
  overrides: [
    {
      files: "*.sol",
      options: {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: false,
        explicitTypes: "always",
      },
    },
  ],
}
