const fs = require("fs");
const schema = require("./semi.schema.json");

const { Validator } = require('jsonschema');
const v = new Validator();

const json = JSON.parse(
    fs.readFileSync("./semi.json", "utf-8")
);

console.log(v.validate(json, schema));
