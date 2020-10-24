import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

export type JsonError = Readonly<{
    jsonPath: string;
    jsonErrors: string[];
}>

export type ValidatorCompilerOptions = Readonly<ts.CompilerOptions & {
    target: ts.ScriptTarget
}>;

export const defaultTsValidatorCompilerOptions: ValidatorCompilerOptions = {
    transpileOnly: true,
    skipLibCheck: true,
    noEmit: true,
    strictNullChecks: true,
    target: ts.ScriptTarget.ES5,
};

type TempName = string;
type TempFileContents = string;
type TempFile = [TempName, TempFileContents]

export type JsonPathWithTypePath = [string, string];

export interface ValidationOptions {
    isDiagnosticsFileCreated: boolean;
}


function getConfigDefinitionInTS(configFileContents: Buffer): string {
    return `const config: Root = ${configFileContents}`;
}

function prepareConfigContentsAndName(configPath: string, typesContents: string) {
    const configFileContents = fs.readFileSync(configPath);
    const configContents = getConfigDefinitionInTS(configFileContents);
    const tempTsFileName = `${path.basename(configPath)}.ts`;
    const tempTsFileContents = `${typesContents}\n${configContents}`;
    return {tempTsFileName, tempTsFileContents};
}

function writeTempTsFile(configPath: string, typesContents: string): string {
    const {tempTsFileName, tempTsFileContents} = prepareConfigContentsAndName(configPath, typesContents);
    fs.writeFileSync(tempTsFileName, tempTsFileContents);
    return tempTsFileName;
}

function getTempTsFileContents(configPath: string, typesContents: string): TempFile {
    const {tempTsFileName, tempTsFileContents} = prepareConfigContentsAndName(configPath, typesContents);
    return [tempTsFileName, tempTsFileContents];
}

function compileTsAndGetErrors(virtualFileName: string, options: ValidatorCompilerOptions, contents: string, validationOptions: ValidationOptions): string[] {
    const compilerHostOriginal = ts.createCompilerHost(options);
    const originalGetSourceFile = compilerHostOriginal.getSourceFile;
    const compilerHost = {
        ...compilerHostOriginal,
        getSourceFile: (filename: string, languageVersion: ValidatorCompilerOptions["target"]) => {
            if (filename === virtualFileName)
                return ts.createSourceFile(filename, contents, options.target);
            return originalGetSourceFile(filename, languageVersion);
        },
    };
    const program = ts.createProgram([virtualFileName], options, compilerHost);
    const emitResult = program.emit();
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    return diagnostics.map((diagnostic: ts.Diagnostic) => {
        return diagnosticToMessage(diagnostic, validationOptions);
    });
}

function diagnosticToMessage(diagnostic: ts.Diagnostic, validationOptions: ValidationOptions): string {
    if (!diagnostic.file) {
        return `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
    }
    const {
        line,
        character,
    } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    let diagnosticsFileName = diagnostic.file.fileName.slice(0,-3);

    if (validationOptions.isDiagnosticsFileCreated) {
        diagnosticsFileName = diagnosticsFileName.slice(0,-3);
    }
    return `${diagnosticsFileName} (${line + 1},${character + 1}): ${text}`;
}

/**
 * Validation json files using Typescript declaration files
 * @param jsonWithDeclaration
 * @param validationOptions
 * @param compilerOptions
 */
export function validate(
    jsonWithDeclaration: Readonly<JsonPathWithTypePath[]>,
    validationOptions: ValidationOptions = {
        isDiagnosticsFileCreated: false,
    },
    compilerOptions = defaultTsValidatorCompilerOptions
): ReadonlyArray<JsonError>  {
    const errors: JsonError[] = [];
    for (const [jsonFile, typesPath] of jsonWithDeclaration) {
        const typesContents = fs.readFileSync(
            path.join(process.cwd(), typesPath)
        ).toString();

        if (validationOptions.isDiagnosticsFileCreated) {
            writeTempTsFile(jsonFile, typesContents);
        }

        const [tempTsFileName, tempTsFileContents] = getTempTsFileContents(jsonFile, typesContents);
        const configErrors = compileTsAndGetErrors(tempTsFileName, compilerOptions, tempTsFileContents, validationOptions);
        if (configErrors.length) {
            errors.push({
                jsonPath: jsonFile,
                jsonErrors: configErrors,
            });
        }
    }
    return errors;
}

export default validate;

