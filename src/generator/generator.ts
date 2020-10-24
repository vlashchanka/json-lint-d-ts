import { InputData, jsonInputForTargetLanguage, quicktypeMultiFileSync } from "quicktype-core";
import * as fs from "fs";
import * as path from "path";
import { hasAsyncSamples, normalizeSamples, prepareSamples } from "./utils/sample";

type UrlSamples = string | string[];
type JSONSamples = object | object[];

export type GeneratorSamples = JSONSamples | UrlSamples

function getTypescriptLinesFromJson(json: GeneratorSamples, typeName: string): string[] {
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
 * @param samples
 * @param options
 */
export function generate<T extends GeneratorSamples>(samples: T, options: GeneratorOptions): string {
    if (hasAsyncSamples(samples)) {
        throw new Error("Your samples contain URL, which could be processed only with async version generateAsync()");
    }
    return generateJsons(normalizeSamples(samples), options);
}

/**
 * Generate Typescript file automatically
 * @param samples
 * @param options
 */
export async function generateAsync<T extends GeneratorSamples>(samples: T, options: GeneratorOptions): Promise<string> {
    const preparedSamples = await prepareSamples(samples);
    return generateJsons(preparedSamples, options);
}

export function generateJsons<T extends GeneratorSamples>(samples: T, options: GeneratorOptions): string {
    const { name, shouldOutput, outputPath } = options;
    const result = getTypescriptLinesFromJson(samples, name);
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
