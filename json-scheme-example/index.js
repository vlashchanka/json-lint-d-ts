const { Validator } = require('jsonschema');
const v = new Validator();

const configInstance = { a: "a" };

const schema =
    {
        "type": "object",
        "required": [
            "name",
            "rule",
            "id"
        ],
        "additionalProperties": [
            "description"
        ],
        "properties": {
            "rule": {
                "type": "string"
            },
            "level": {
                "type": "string",
                "enum": ["level", "warn"]
            },
            "id": {
                "type": "string"
            }
        }
    };

console.log(v.validate(configInstance, schema));
