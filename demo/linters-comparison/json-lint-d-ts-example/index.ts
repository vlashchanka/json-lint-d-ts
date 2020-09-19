import { validate } from "json-lint-d-ts";

const result = validate([
    ["./semi.json", "./semi.d.ts"],
], {
    isDiagnosticsFileCreated: false,
});
console.log(result);

