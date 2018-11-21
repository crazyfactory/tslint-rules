import * as fs from "fs";
import * as Lint from "tslint";
import * as ts from "typescript";

interface ILanguageData {
    reference: { base: string, group: string }[];
}

class LanguageRule extends Lint.RuleWalker {
    constructor(
        sourceFile: ts.SourceFile,
        option: Lint.IOptions,
        private program: ts.Program,
        private readonly languageData: ILanguageData
    ) {
        super(sourceFile, option);
    }

    public visitCallExpression(node: ts.CallExpression): void {
        super.visitCallExpression(node);
        if (!node.expression.getChildAt(0)) {
            return;
        }
        const leftSideType: ts.Type = this.program.getTypeChecker().getTypeAtLocation(node.expression.getChildAt(0));
        const leftSideString = this.program.getTypeChecker().typeToString(leftSideType);
        if (leftSideString !== "Translator") {
            return;
        }
        const key: ts.StringLiteral = node.arguments[0] as ts.StringLiteral;
        if (this.doesKeyExist(key.text)) {
            return;
        }
        this.addFailureAtNode(node.arguments[0], "Translation string not found");
    }

    private doesKeyExist(key: string): boolean {
        return this.languageData.reference.some((d) => d.base === key);
    }
}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.TypedRule {
    private readonly jsonData: ILanguageData;
    constructor(options: Lint.IOptions) {
        super(options);
        const path = options.ruleArguments[0].path;
        if (!fs.existsSync(path)) {
            throw new Error(`file not found: ${path}`);
        }
        const data = fs.readFileSync(path);
        this.jsonData = JSON.parse(data.toString());
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new LanguageRule(sourceFile, this.getOptions(), program, this.jsonData));
    }
}
