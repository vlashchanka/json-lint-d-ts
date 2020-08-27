interface LintRule {
    name: string;
    level: "warn" | "error";
}

interface Root extends LintRule {}
