import * as Lint from "tslint";
import * as ts from "typescript";

class EnumSortKeysRule extends Lint.AbstractWalker {
  public walk(sourceFile: ts.SourceFile): void {
    const cb = (node: ts.Node): void => {
      if (ts.isEnumDeclaration(node)) {
        const properties = node.members.map((member) => member.getText());
        const unsortedIndex = this.getUnsortedIndex(properties);
        if (unsortedIndex !== -1) {
          const member = node.members[unsortedIndex];
          this.addFailureAtNode(member.name, `The key "${member.name.getText()}" is not sorted alphabetically`);
        }
      }
      return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(sourceFile, cb);
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
    return this.applyWithWalker(
      new EnumSortKeysRule(
        sourceFile,
        "enum-sort-keys",
        undefined
      )
    );
  }
}
