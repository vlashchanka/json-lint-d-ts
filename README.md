json-lint-d-ts
------
[![npm](https://img.shields.io/npm/v/json-lint-d-ts.svg?maxAge=2592000)](https://www.npmjs.com/package/json-lint-d-ts)
![Node.js CI](https://github.com/vlashchanka/json-lint-d-ts/workflows/Node.js%20CI/badge.svg)
[![Dependency Status][1]][2]
[![Dev Dependency Status][3]][4]


![image](assets/icon.svg)
------

Write type safe json files in your project with Typescript.

## Installation
`yarn -D json-lint-d-ts`

## Usage

### Validation

Import `validate` function and pass all your JSON files paths with their type declarations.

```typescript
import { validate } from "json-lint-d-ts";

const result = validate([
    ["./hello.json", "./hello.d.ts"],
]);

/*
[
  {
    jsonPath: './hello.json',
    jsonErrors: [
      `hello.json (13,3): Type '"World"' is not assignable to type '"world"'.`
    ]
  }
]
*/
console.log(result);
```

Typescript declaration example:

⚠️ it is important to have `type Root` in your `d.ts` file ⚠️

```typescript
interface HelloLowerCase {
    hello: "world";
}
interface HelloUpperCase {
    HELLO: "WORLD";
}

type HelloType = HelloLowerCase | HelloUpperCase;

type Root = HelloType

```

The `result` of the validation:

```shell script
[
  {
    jsonPath: './hello.json',
    jsonErrors: [
      `hello.json (13,3): Type '"World"' is not assignable to type '"world"'.`
    ]
  }
]
```

The usage example could be found in `demo/hello-world` folder.


### Generation

It is possible to generate typescript files automatically for existing jsons ([quicktype](https://github.com/quicktype/quicktype) is used under the hood).

```typescript
const name = "LintRule";
generate(
    {
        id: "rule-semi",
        name: "semi",
        description: "Rule to describe usage of semicolons",
        level: "warning",
        isLevel: false,
    },
    {
        name: name,
        shouldOutput: true,
    }
);
```

It will output the file: `LintRule.d.ts` with the following contents:

```typescript
export interface LintRule {
    id:          string;
    name:        string;
    description: string;
    level:       string;
    isLevel:     boolean;
}

interface Root extends LintRule {}
```



## Troubleshooting

You could pass boolean value `isDiagnosticsFileCreated` in the object as a second
argument to the `validate` function

```typescript
import { validate } from "json-lint-d-ts";

const result = validate([
    ["./hello.json", "./hello.d.ts"],
], {
    isDiagnosticsFileCreated: true,
});
```

This will generate a joined file near your json document `hello.json.ts`
with your types and json content where you could manually compare the difference.


## How does all this work?
Under the hood *json-lint-d-ts* uses Typescript Compiler by extending compiler host.
JSON objects are loaded from filesystem and compared against passed `.d.ts` files.
The result is extracted from diagnostics. 

## Contributing
Please do!

## Alternatives

- [jsonschema](https://www.npmjs.com/package/jsonschema): JSON Schema is a vocabulary that allows you to annotate and validate JSON documents http://json-schema.org/.
- [joi](https://www.npmjs.com/package/joi): schema description language and data validator for JavaScript.

## Enjoy

🚀

[1]: https://david-dm.org/vlashchanka/json-lint-d-ts.svg
[2]: https://david-dm.org/vlashchanka/json-lint-d-ts
[3]: https://david-dm.org/vlashchanka/json-lint-d-ts/dev-status.svg
[4]: https://david-dm.org/vlashchanka/json-lint-d-ts?type=dev
  
