import {
    window,
    TextEditor,
    TextEditorEdit,
    Range,
} from "vscode";
import {
    HEADER_SYMBOL,
    MAX_HEADER_DEPTH,
    getCurrentScope,
    getLine,
} from "./utils";

export function demoteTree(textEditor: TextEditor, edit: TextEditorEdit) {
    const currentScope = getCurrentScope(textEditor);
    if (currentScope === null) {
        window.showWarningMessage("No section to demote");
        return;
    }

    const depth = currentScope.depth;
    if (currentScope.depth >= MAX_HEADER_DEPTH) {
        return;
    }

    edit.insert(currentScope.start, HEADER_SYMBOL);

    const childHeadingRegExp = getChildHeadingRegEx(depth);

    const document = textEditor.document;
    let currPos = currentScope.start.with();
    let currLine: string;
    let match: RegExpMatchArray | null;
    for (let i = currentScope.start.line; i < currentScope.end.line; i++) {
        currPos = currPos.translate(1, 0);
        currLine = getLine(document, currPos);
        match = currLine.match(childHeadingRegExp);

        if (match !== null && match[0].trim().length < MAX_HEADER_DEPTH) {
            edit.insert(currPos, HEADER_SYMBOL);
        }
    }
}

export function promoteTree(textEditor: TextEditor, edit: TextEditorEdit) {
    const currentScope = getCurrentScope(textEditor);
    if (currentScope === null) {
        window.showWarningMessage("No section to promote");
        return;
    }

    const depth = currentScope.depth;
    if (depth > 1) {
        edit.delete(new Range(currentScope.start, currentScope.start.translate(0, 1)));
    }

    const childHeadingRegExp = getChildHeadingRegEx(depth);

    const document = textEditor.document;
    let currPos = currentScope.start.with();
    let currLine: string;
    for (let i = currentScope.start.line; i < currentScope.end.line; i++) {
        currPos = currPos.translate(1, 0);
        currLine = getLine(document, currPos);

        if (childHeadingRegExp.test(currLine)) {
            edit.delete(new Range(currPos, currPos.translate(0, 1)));
        }
    }
}

function getChildHeadingRegEx(depth: number) {
    return new RegExp(`^${HEADER_SYMBOL}{${depth + 1},}\\s`);
}