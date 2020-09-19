const fs = require("fs");
const { Validator } = require('jsonschema');

const v = new Validator();
const json = JSON.parse(
    fs.readFileSync("./semi.json", "utf-8")
);
const schema = require("./semi.schema.json");

console.log(v.validate(json, schema));
