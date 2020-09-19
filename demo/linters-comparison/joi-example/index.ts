import * as fs from "fs";
// @ts-ignore - no issues with ts-node
import { semi } from "./semi.scheme";

const json = JSON.parse(
    fs.readFileSync("./semi.json", "utf-8")
);

const result = semi.validate(json);

console.log(result);
