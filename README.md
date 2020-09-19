json-lint-d-ts
------

Write type safe json files in your project with Typescript.

## Installation
`yarn -D json-lint-d-ts`

## Usage
First, import the validate function and pass all your JSON files paths with their type declarations:

```typescript
import { validate } from "json-lint-d-ts";

const result = validate([
    ["./hello.json", "./hello.d.ts"],
]);
console.log(result);
```

An example of json file *hello.json*:

```json
{
  "hello": "World"
}
```

An dummy example of failing typescript declaration for it:

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

The `result` variable should contain after run:

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

The described above example could be found in `demo/hello-world` folder.

## How does all this work?
Under the hood *json-lint-d-ts* uses Typescript Compiler by extending compiler host.
JSON objects are loaded from filesystem and compared against passed `.d.ts` files.
The result is extracted from diagnostics. 

## Contributing
Please do!
