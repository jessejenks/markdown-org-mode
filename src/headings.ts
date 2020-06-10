import {
    window,
    TextEditor,
    TextEditorEdit,
    Position,
} from "vscode";
import {
    HEADER_SYMBOL,
    MAX_HEADER_DEPTH,
    getCurrentScope,
    getCursorPosition,
    moveCursorToEndOfLine,
    getLine,
} from "./utils";


export function insertHeading(textEditor: TextEditor, edit: TextEditorEdit) {
    const currentScope = getCurrentScope(textEditor);
    if (currentScope === null) {
        const cursorPos = getCursorPosition();
        if (cursorPos === null) {
            return;
        }

        const currentLine = getLine(textEditor.document, cursorPos);
        let insertedHeaderSymbol: string = HEADER_SYMBOL + " ";
        if (currentLine !== "") {
            insertedHeaderSymbol = "\n" + insertedHeaderSymbol;
        }
        edit.insert(cursorPos.with({ character: currentLine.length }), insertedHeaderSymbol);
        moveCursorToEndOfLine(textEditor, cursorPos);
        return;
    }

    insertHeadingAtPosition(textEditor, edit, currentScope.depth, currentScope.end);
}

export function insertSubheading(textEditor: TextEditor, edit: TextEditorEdit) {
    const currentScope = getCurrentScope(textEditor);
    if (currentScope === null) {
        window.showWarningMessage("No section to insert subheading into");
        return;
    }

    insertHeadingAtPosition(textEditor, edit, currentScope.depth + 1, currentScope.end);
}

type InsertHeadingOptions = {
    addNewlineOnNonemptyLine: boolean;
    goToEndOfLine: boolean;
}
function insertHeadingAtPosition(
    textEditor: TextEditor,
    edit: TextEditorEdit,
    headingDepth: number,
    position: Position,
    options: InsertHeadingOptions = {
        addNewlineOnNonemptyLine: true,
        goToEndOfLine: true
    }
) {
    let insertedHeaderSymbol = "";

    if (options.addNewlineOnNonemptyLine && getLine(textEditor.document, position) !== "") {
        insertedHeaderSymbol = "\n";
    }

    for (let i = 0; i < Math.min(headingDepth, MAX_HEADER_DEPTH); i++) {
        insertedHeaderSymbol += HEADER_SYMBOL;
    }
    insertedHeaderSymbol += " ";

    edit.insert(position, insertedHeaderSymbol);
    if (options.goToEndOfLine) {
        moveCursorToEndOfLine(textEditor, position);
    }
}