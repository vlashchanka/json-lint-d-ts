import isUrl from "is-url";
import fetch from "node-fetch";

type UrlSample = string;
type JSONSample = object;

export type GeneratorSample = UrlSample | JSONSample;
export type GeneratorSamples = GeneratorSample | GeneratorSample[];

export async function prepareSamples(samples: GeneratorSamples | GeneratorSample): Promise<object[]> {
    const promises = normalizeSamples(samples).map(s => {
        if (typeof s === "string") {
            if (isUrl(s)) {
                return fetch(s).then(r => r.json());
            }
            return Promise.resolve(JSON.parse(s));
        } else {
            return s;
        }
    });
    return Promise.all(promises);
}

export function normalizeSamples(samples: GeneratorSamples | GeneratorSample): GeneratorSamples[] {
    return Array.isArray(samples)
        ? samples
        : [samples];
}

export function hasAsyncSamples(samples: GeneratorSamples | GeneratorSample): boolean {
    const normalizedSamples = Array.isArray(samples)
        ? samples
        : [samples];

    return normalizedSamples.some(s => typeof s === "string" && isUrl(s));
}
