import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript"

type R = typeof fs.readFileSync;
type W = typeof fs.writeFileSync;

type IO<M = (R | W | (R | W) | (R & W) ), S = void> = S;

const tsOptions: ts.CompilerOptions = {
    transpileOnly: true,
    skipLibCheck: true,
    noEmit: true,
    strictNullChecks: true,
    target: ts.ScriptTarget.ES5,
};

const IS_DIAGNOSTICS_FILE_CREATED = false;

function writeTempTsFile(configPath: string, typesContents: string): IO<W, string> {
    const configFileContents = fs.readFileSync(configPath);
    const configContents = `const config: Root = ${configFileContents}`;
    const tempTsFileName = `${path.basename(configPath)}.ts`;
    const tempTsFileContents = `${typesContents}\n${configContents}`;
    fs.writeFileSync(tempTsFileName, tempTsFileContents);
    return tempTsFileName;
}

type TempName = string;
type TempFileContents = string;
type TempFile = [TempName, TempFileContents]

function getTempTsFileContents(configPath: string, typesContents: string): IO<R, TempFile> {
    const configFileContents = fs.readFileSync(configPath);
    const configContents = `const config: Root = ${configFileContents}`;
    const tempTsFileName = `${path.basename(configPath)}.ts`;
    const tempTsFileContents = `${typesContents}\n${configContents}`;
    return [tempTsFileName, tempTsFileContents];
}

type ConfigError = Readonly<{
    configPath: string;
    configErrors: string[];
}>

function validateConfigsWithTs(configPaths): IO<R | R & W, ReadonlyArray<ConfigError>>  {
    const errors = [];
    for (const [configPath, typesPath] of configPaths) {
        const typesContents = fs.readFileSync(
            path.join(__dirname, typesPath)
        ).toString();

        if (IS_DIAGNOSTICS_FILE_CREATED) {
            writeTempTsFile(configPath, typesContents);
        }

        const [tempTsFileName, tempTsFileContents] = getTempTsFileContents(configPath, typesContents);
        const configErrors = compileTsAndGetErrors([tempTsFileName], tsOptions, tempTsFileContents);
        if (configErrors.length) {
            errors.push({
                configPath: configPath,
                configErrors: configErrors,
            });
        }
    }
    return errors;
}

function compileTsAndGetErrors([virtualFileName], options: ts.CompilerOptions, contents: string): string[] {
    const compilerHostOriginal = ts.createCompilerHost(options);
    const originalGetSourceFile = compilerHostOriginal.getSourceFile;
    const compilerHost = {
        ...compilerHostOriginal,
        getSourceFile: (filename, languageVersion) => {
            if (filename === virtualFileName)
                return ts.createSourceFile(filename, contents, options.target);
            return originalGetSourceFile(filename, languageVersion);
        },
    };
    const program = ts.createProgram([virtualFileName], options, compilerHost);
    const emitResult = program.emit();
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    return diagnostics.map(diagnosticToMessage);
}

function diagnosticToMessage(diagnostic: ts.Diagnostic): string {
    if (!diagnostic.file) {
        return `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
    }
    const {
        line,
        character,
    } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    let diagnosticsFileName = diagnostic.file.fileName.slice(0,-3);

    if (IS_DIAGNOSTICS_FILE_CREATED) {
        diagnosticsFileName = diagnosticsFileName.slice(0,-3);
    }
    return `${diagnosticsFileName} (${line + 1},${character + 1}): ${text}`;
}

const result = validateConfigsWithTs([
    ["./semi.json", "./linter.d.ts"]
]);
console.log(result);
