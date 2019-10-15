import * as Lint from "tslint";
import * as ts from "typescript";

interface IOption {
  type: "star" | "default";
}

class ImportReactRule extends Lint.AbstractWalker<IOption> {
  public walk(sourceFile: ts.SourceFile): void {
    if (sourceFile.isDeclarationFile) {
      return;
    }
    const cb = (node: ts.Node): void => {
      if (
        ts.isImportDeclaration(node)
        && node.moduleSpecifier.getText(sourceFile) === `"react"`
        && node.importClause
      ) {
        // import * as React has namedBindings, and import React has only name
        if (this.options.type === "star" && !node.importClause.namedBindings) {
          this.addFailureAtNode(node, "You must use `import * as React from 'react'`");
        } else if (this.options.type === "default" && node.importClause.namedBindings) {
          this.addFailureAtNode(node, "You must use `import React from 'react'`");
        }
      }
      return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(sourceFile, cb);
  }
}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new ImportReactRule(
        sourceFile,
        "import-react",
        {type: this.ruleArguments[0] && this.ruleArguments[0].type ? this.ruleArguments[0].type : "star"}
      )
    );
  }
}
