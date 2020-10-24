import { validate } from "./validator";

const mockJsonName = "fake.json";
const mockDeclarationName = "fake.d.ts";

const fakeConfig: [string, string][] = [
    [mockJsonName, mockDeclarationName]
];

const mockReadFileSync = jest.fn();

jest.mock("fs", () => {
    return {
        readFileSync: (name: string) => mockReadFileSync(name),
        writeFileSync: jest.fn()
    };
});

describe("validate()", () => {
    it("should return error list for for inconsistent json and delcaration", () => {
        mockFsCalls({
            json: "{\"a\": 1}",
            ts: "type Root = { a: string; }",
        });
        expect(validate(fakeConfig)).toStrictEqual(
            [{"jsonErrors": ["fake.json (2,23): Type 'number' is not assignable to type 'string'."], "jsonPath": "fake.json"}]
        );
    });

    it("should return empty error list for consistent json and declaration", () => {
        mockFsCalls({
            json: "{\"a\": \"1\"}",
            ts: "type Root = { a: string; }",
        });
        expect(validate(fakeConfig)).toStrictEqual([]);
    });
});

function mockFsCalls({ json, ts }: { json: string, ts: string}) {
    mockReadFileSync.mockImplementation((fileName: string) => {
        if (fileName.includes(mockJsonName)) {
            return json;
        }
        if (fileName.includes(mockDeclarationName)) {
            return ts;
        }
        return jest
            .requireActual("fs")
            .readFileSync(fileName);
    });
}
