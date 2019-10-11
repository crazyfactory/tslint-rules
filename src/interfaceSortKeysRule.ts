import * as Lint from "tslint";
import {Identifier} from "typescript";
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
    const properties = node.members.map((member) => (member.name as Identifier).escapedText.toString());
    const unsortedIndex = this.getUnsortedIndex(properties);
    if (unsortedIndex !== -1) {
      this.addFailureAtNode(
        node.members[unsortedIndex].name as Identifier,
        `The key '${(node.members[unsortedIndex].name as Identifier).escapedText}' is not sorted alphabetically`
      );
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
