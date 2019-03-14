import * as Lint from "tslint";
import * as ts from "typescript";

class JsxSpaceBeforeTrailingSlashRule extends Lint.RuleWalker {
  private readonly enforceWhiteSpace: boolean = true;
  constructor(
    sourceFile: ts.SourceFile,
    options: Lint.IOptions
  ) {
    super(sourceFile, options);
    if (options.ruleArguments[0] === "never") {
      this.enforceWhiteSpace = false;
    }
  }

  private static hasWhitespaceBeforeClosing(nodeText: string): boolean {
    return /\s/.test(nodeText.charAt(nodeText.length - "/>".length - 1));
  }

  public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
    super.visitJsxSelfClosingElement(node);
    if (this.enforceWhiteSpace) {
      if (!JsxSpaceBeforeTrailingSlashRule.hasWhitespaceBeforeClosing(node.getText())) {
        this.addFailureAtNode(node, "Self-closing JSX elements must have a space before the '/>' part");
        return;
      }
    } else {
      if (!/[\r\n]/.test(node.getText()) && JsxSpaceBeforeTrailingSlashRule.hasWhitespaceBeforeClosing(node.getText())) {
        this.addFailureAtNode(node, "One-line self-closing JSX elements must not have a space(s) before the '/>' part");
        return;
      }
    }
  }
}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.TypedRule {
  public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
    return this.applyWithWalker(new JsxSpaceBeforeTrailingSlashRule(sourceFile, this.getOptions()));
  }
}
