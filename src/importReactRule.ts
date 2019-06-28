import * as Lint from "tslint";
import * as ts from "typescript";

class ImportReactRule extends Lint.AbstractWalker<void> {
    private static isImportDeclaration(node: ts.Node): node is ts.ImportDeclaration {
        return node.kind === ts.SyntaxKind.ImportDeclaration;
    }

    public walk(sourceFile: ts.SourceFile): void {
        if (sourceFile.isDeclarationFile) {
            return;
        }
        const cb = (node: ts.Node): void => {
            if (!ImportReactRule.isImportDeclaration(node)) {
                return ts.forEachChild(node, cb);
            }
            // tslint:disable-next-line:no-multiline-string
            if (node.moduleSpecifier.getText(sourceFile) === `"react"`) {
                if (node.importClause) {
                    // import * as React has namedBindings, and import React has only name
                    if (!node.importClause.namedBindings) {
                        // throw error
                        this.addFailureAtNode(node, "You must use `import * as React`");
                    }
                }
            }
            return ts.forEachChild(node, cb);
        };
        ts.forEachChild(sourceFile, cb);
    }

}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ImportReactRule(sourceFile, "import-react", undefined));
    }
}
