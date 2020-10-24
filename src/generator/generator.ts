import { InputData, jsonInputForTargetLanguage, quicktypeMultiFileSync } from "quicktype-core";
import * as fs from "fs";
import * as path from "path";

export type JsonSamples = object | object[]

function getTypescriptLinesFromJson(json: JsonSamples, typeName: string): string[] {
    const targetLanguage = "TypeScript";
    const jsonInput = jsonInputForTargetLanguage(targetLanguage);
    const samples = Array.isArray(json)
        ? json
        : [json];
    jsonInput.addSourceSync({
        name: typeName,
        samples: samples.map(j => JSON.stringify(j)),
    });
    const inputData = new InputData();
    inputData.addInput(jsonInput);
    const result = quicktypeMultiFileSync({
        inputData,
        lang: targetLanguage,
        rendererOptions: {
            "just-types": "true",
        }
    });
    return result.get("stdout")?.lines || [];
}


export interface GeneratorOptions {
    name: string;
    outputPath?: string;
    shouldOutput?: boolean;
}

/**
 * Generate Typescript file automatically
 * @param json
 * @param options
 */
export function generate<T extends JsonSamples>(json: T, options: GeneratorOptions): string {
    const { name, shouldOutput, outputPath } = options;
    const result = getTypescriptLinesFromJson(json, name);
    const lineToHaveValidatorWorking = `interface Root extends ${name} {}`;
    const lines = [
        ...result,
        lineToHaveValidatorWorking,
    ];
    const fileContents = lines.join("\n");
    if (shouldOutput) {
        const generatedPath = outputPath || path.join(process.cwd(), `${name}.d.ts`);
        fs.writeFileSync(generatedPath, fileContents, {
            encoding: "utf8",
        });
    }
    return fileContents;
}
