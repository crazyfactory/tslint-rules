import * as Lint from "tslint";
import * as ts from "typescript";

class InterfaceSortKeysRule extends Lint.RuleWalker {
  constructor(
    sourceFile: ts.SourceFile,
    options: Lint.IOptions
  ) {
    super(sourceFile, options);
  }

  public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
    super.visitInterfaceDeclaration(node);
    this.checkAlphabetical(node);
  }

  public visitTypeLiteral(node: ts.TypeLiteralNode): void {
    super.visitTypeLiteral(node);
    this.checkAlphabetical(node);
  }

  private checkAlphabetical(node: ts.InterfaceDeclaration | ts.TypeLiteralNode): void {
    const properties = node.members.map((member) => member.getText());
    const unsortedIndex = this.getUnsortedIndex(properties);
    if (unsortedIndex !== -1) {
      const member = node.members[unsortedIndex];
      if (ts.isIndexSignatureDeclaration(member)) {
        this.addFailureAtNode(member.parameters[0], `The key "${member.parameters[0].getChildAt(0).getText()}" is not sorted alphabetically`);
      } else if (ts.isPropertySignature(member)) {
        this.addFailureAtNode(member.name, `The key "${member.name.getText()}" is not sorted alphabetically`);
      } else {
        throw new Error(`
          Unknown Node Type!
          This might be a case that's not covered yet.
          Please file an issue at https://github.com/crazyfactory/tslint-rules
        `);
      }
    }
  }

  private getUnsortedIndex(strs: string[], startIndex: number = 0): number {
    if (strs.length < 2 || strs.length === startIndex + 1) {
      return -1;
    }
    if (strs[startIndex] > strs[startIndex + 1]) {
      return startIndex;
    }
    return this.getUnsortedIndex(strs, startIndex + 1);
  }
}

// tslint:disable-next-line:export-name max-classes-per-file
export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new InterfaceSortKeysRule(sourceFile, this.getOptions()));
  }
}
