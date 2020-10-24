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

It is possible to generate typescript files automatically for existing jsons:

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


Advanced usage:

In case you want to generate schemas from endpoint, `json-lint-d-ts` supports
url samples:


```typescript
const name = "UsersEndpoint";
const result = await generateAsync(["https://reqres.in/api/users?page=1"],
    {
        name: name,
        shouldOutput: true,
    }
);
```

In case API returns such data back:

```json
{
    "page": 1,
    "per_page": 6,
    "total": 12,
    "total_pages": 2,
    "data": [{
        "id": 1,
        "email": "george.bluth@yourwebsite.com",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://s3.amazonaws.com/avatar.jpg"
    }, {
        "id": 2,
        "email": "janet.weaver@yourwebsite.com",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://s3.amazonaws.com/avatar.jpg"
    }, {
        "id": 3,
        "email": "emma.wong@yourwebsite.com",
        "first_name": "Emma",
        "last_name": "Wong",
        "avatar": "https://s3.amazonaws.com/avatar.jpg"
    }, {
        "id": 4,
        "email": "eve.holt@yourwebsite.com",
        "first_name": "Eve",
        "last_name": "Holt",
        "avatar": "https://s3.amazonaws.com/avatar.jpg"
    }, {
        "id": 5,
        "email": "charles.morris@yourwebsite.com",
        "first_name": "Charles",
        "last_name": "Morris",
        "avatar": "https://s3.amazonaws.com/avatar.jpg"
    }, {
        "id": 6,
        "email": "tracey.ramos@yourwebsite.com",
        "first_name": "Tracey",
        "last_name": "Ramos",
        "avatar": "https://s3.amazonaws.com/avatar.jpg"
    }],
    "ad": {
        "company": "Weekly News",
        "url": "http://news.org/",
        "text": "A weekly newsletter focusing on development"
    }
    }
```
 the following TS file would be generated:

```typescript
// UsersEndpoint.d.ts

export interface UsersEndpoint {
    page:        number;
    per_page:    number;
    total:       number;
    total_pages: number;
    data:        Datum[];
    ad:          Ad;
}

export interface Ad {
    company: string;
    url:     string;
    text:    string;
}

export interface Datum {
    id:         number;
    email:      string;
    first_name: string;
    last_name:  string;
    avatar:     string;
}

interface Root extends UsersEndpoint {}
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

### JSON validation:

Under the hood *json-lint-d-ts* uses Typescript Compiler by extending compiler host.
JSON objects are loaded from filesystem and compared against passed `.d.ts` files.
The result is extracted from diagnostics. 

### Typescript Schema generation:

For Typescript files generation from raw JSON [quicktype](https://github.com/quicktype/quicktype) is used

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
  
