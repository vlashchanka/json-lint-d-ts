import { validate } from "json-lint-d-ts";

const result = validate([
    ["./semi.json", "./linter.d.ts"],
], {
    isDiagnosticsFileCreated: true,
});
console.log(result);

