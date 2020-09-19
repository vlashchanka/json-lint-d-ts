interface LintRule {
    name: string;
    level: "warn" | "error";
    description?: string;
    id: string;
}

interface Root extends LintRule {}
