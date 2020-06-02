import {
    window,
    TextEditor,
    TextEditorEdit,
    Position,
    Range,
} from "vscode";
import {
    HEADER_SYMBOL,
    MAX_HEADER_DEPTH,
    getCurrentScope,
    getCursorPosition,
    getCursorPositions,
    moveCursorToEndOfLine,
    getLine,
    getStartOfCurrentScope,
    getStartOfHeading,
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

export function toggleLineAndHeading(textEditor: TextEditor, edit: TextEditorEdit) {
    const cursorPos = getCursorPosition();
    if (cursorPos === null) {
        return;
    }

    const currentLine = getLine(textEditor.document, cursorPos);
    const startOfHeading = getStartOfHeading(currentLine);

    if (startOfHeading !== null) {
        const numCharsToRemove = startOfHeading.length + 1;
        edit.delete(new Range(cursorPos.with({ character: 0 }), cursorPos.with({ character: numCharsToRemove })));
        return;
    }

    let depth = 1;
    const headerPrefix = getStartOfCurrentScope(textEditor.document, cursorPos);
    if (headerPrefix !== null) {
        depth = Math.min(headerPrefix.startOfHeading.length, MAX_HEADER_DEPTH);
    }

    insertHeadingAtPosition(textEditor, edit, depth, cursorPos.with({ character: 0 }), {
        addNewlineOnNonemptyLine: false,
        goToEndOfLine: false,
    });
}

export function demoteHeading(textEditor: TextEditor, edit: TextEditorEdit) {
    const positions = getCursorPositions();
    if (positions === null) {
        return;
    }

    const document = textEditor.document;
    let demotedSomeLine: boolean = false;
    let position: Position;
    let startOfHeading: string | null;
    for (let i = 0; i < positions.length; i++) {
        position = positions[i];
        startOfHeading = getStartOfHeading(getLine(document, position));
        if (startOfHeading === null || startOfHeading.length >= MAX_HEADER_DEPTH) {
            continue;
        }

        demotedSomeLine = true;
        edit.insert(position.with({ character: 0 }), HEADER_SYMBOL);
    }

    if (!demotedSomeLine) {
        window.showWarningMessage("No line to demote");
    }
}

export function promoteHeading(textEditor: TextEditor, edit: TextEditorEdit) {
    const positions = getCursorPositions();
    if (positions === null) {
        return;
    }

    const document = textEditor.document;
    let promotedSomeLine: boolean = false;
    let position: Position;
    let startOfHeading: string | null;
    for (let i = 0; i < positions.length; i++) {
        position = positions[i];
        startOfHeading = getStartOfHeading(getLine(document, position));
        if (startOfHeading === null || startOfHeading.length === 1) {
            continue;
        }

        promotedSomeLine = true;
        edit.delete(new Range(
            position.with({ character: 0 }),
            position.with({ character: 1 })
        ));
    }

    if (!promotedSomeLine) {
        window.showWarningMessage("No line to promote");
    }
}