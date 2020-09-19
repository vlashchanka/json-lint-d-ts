const { validate } = require("json-lint-d-ts");

const result = validate([
    ["./hello.json", "./hello.d.ts"]
]);

console.log(result)
