import { generate, generateAsync } from "./generator";

jest.mock("node-fetch", () => {
    return jest.fn().mockImplementation(
        () => {
            return Promise.resolve({
                json: () => {
                    return {
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
                    };
                }
            });
        }
    );
});

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
                shouldOutput: false,
            }
        );
        expect(result).toMatchSnapshot();
    });
});

describe("generateAsync()", () => {
    it("should generate typescript file from url", async () => {
        const name = "UsersEndpoint";
        const result = await generateAsync(["https://yoursite.com/users"],
            {
                name: name,
                shouldOutput: false,
            }
        );
        expect(result).toMatchSnapshot();
    });
});
