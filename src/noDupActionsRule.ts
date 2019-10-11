import * as Lint from "tslint";
import * as ts from "typescript";

class NoDupActionsRule extends Lint.RuleWalker {
  public actionNames: string[] = [];

  constructor(
    sourceFile: ts.SourceFile,
    options: Lint.IOptions
  ) {
    super(sourceFile, options);
  }

  public visitCallExpression(node: ts.CallExpression): void {
    super.visitCallExpression(node);
    if (ts.isIdentifier(node.expression)) {
      if (node.expression.escapedText === "createAsyncActions") {
        for (const argument of node.arguments) {
          if (this.actionNames.indexOf(argument.getText()) !== -1) {
            this.addFailureAtNode(argument, "Duplicate redux action");
            return;
          }
          this.actionNames.push(argument.getText());
        }
      }
      if (node.expression.escapedText === "createAction") {
        if (this.actionNames.indexOf(node.arguments[0].getText()) !== -1) {
          this.addFailureAtNode(node.arguments[0], "Duplicate redux action");
          return;
        }
        this.actionNames.push(node.arguments[0].getText());
      }
    }
  }
}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoDupActionsRule(sourceFile, this.getOptions()));
  }
}
