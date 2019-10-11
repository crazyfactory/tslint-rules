import * as Lint from "tslint";
import * as ts from "typescript";

class CreateAsyncActionsRule extends Lint.RuleWalker {
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
        if (node.arguments.length !== 4) {
          this.addFailureAtNode(node, "Number of arguments of createAsyncActions must be 4");
          return;
        }

        const firstArg = node.arguments[0].getText();
        const secondArg = node.arguments[1].getText();
        if (secondArg.substring(1, secondArg.length - 1) !== firstArg.substring(1, firstArg.length - 1) + "_PENDING") {
          this.addFailureAtNode(
            node.arguments[1],
            "Second argument of createAsyncActions must be the first argument followed by _PENDING"
          );
          return;
        }

        const thirdArg = node.arguments[2].getText();
        if (thirdArg.substring(1, thirdArg.length - 1) !== firstArg.substring(1, firstArg.length - 1) + "_FULFILLED") {
          this.addFailureAtNode(
            node.arguments[2],
            "Third argument of createAsyncActions must be the first argument followed by _FULFILLED"
          );
          return;
        }

        const fourthArg = node.arguments[3].getText();
        if (fourthArg.substring(1, fourthArg.length - 1) !== firstArg.substring(1, firstArg.length - 1) + "_REJECTED") {
          this.addFailureAtNode(
            node.arguments[3],
            "Fourth argument of createAsyncActions must be the first argument followed by _REJECTED"
          );
          return;
        }
      }
    }
  }
}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CreateAsyncActionsRule(sourceFile, this.getOptions()));
  }
}
