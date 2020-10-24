import { generate } from "./generator";

describe("generate()", () => {
    it("should generate typescript file from json", () => {
        const name = "LintRule";
        const result = generate(
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
        expect(result).toMatchSnapshot();
    });
});
