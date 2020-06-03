import {
    TextEditor,
    TextEditorEdit,
    window,
    Position,
    Range
} from "vscode";
import {
    getLine,
    getCursorPositions,
    getCheckboxIdentifier,
    findCheckboxPrefix,
    characterRangeToRange,
} from "./utils";

export function toggleLineAndCheckbox(textEditor: TextEditor, edit: TextEditorEdit) {
    const cursorPositions = getCursorPositions();
    if (cursorPositions === null) {
        return;
    }

    const checkboxIdentifier = getCheckboxIdentifier();

    let cursorPos: Position;
    for (let i = 0; i < cursorPositions.length; i++) {
        cursorPos = cursorPositions[i];

        const currentLine = getLine(textEditor.document, cursorPos);
        const checkboxPrefix = findCheckboxPrefix(currentLine, checkboxIdentifier);
        if (checkboxPrefix !== null) {
            edit.delete(characterRangeToRange(cursorPos, checkboxPrefix.boxRange));
            continue;
        }

        const startOfTextPrefix = findStartOfText(currentLine);
        if (startOfTextPrefix !== null) {
            edit.insert(cursorPos.with({ character: startOfTextPrefix }), "- [ ] ");
        }
    }
}

const startOfTextRe = /^[ \t]*/;
function findStartOfText(line: string) {
    const match = line.match(startOfTextRe);
    if (match === null || match.index === undefined) {
        return null;
    }

    return match[0].length;
}