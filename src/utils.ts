import {
    window,
    workspace,
    Position,
    TextEditor,
    TextDocument,
    Range,
    Selection,
} from "vscode";

export const HEADER_SYMBOL = "#";
export const MAX_HEADER_DEPTH = 6;
const START_OF_HEADER_LINE_REGEX = new RegExp(`^${HEADER_SYMBOL}+( |\\t)`);

export class Scope extends Range {
    depth: number = 0;
    constructor(start: Position, end: Position, depth: number) {
        super(start, end);
        this.depth = depth;
    }
}

/**
 * Gets the current scope surrounding the current active cursor position.
 * "Scope" here means scope of a heading block.
 * @param textEditor The active text editor
 * @returns The start and end positions of the current scope, as well as the depth
 * @example
 * ```
 * # 1
 * ## 1.1
 * ### 1.1.1
 * # 2
 * ## 2.1
 * ### 2.1.1
 * ### 2.1.2
 * ```
 * Active cursor on line 0 would return
 * ```
 * {
 *     start: (0, 0),
 *     end: (2, 9),
 *     depth: 1,
 * }
 * ```
 * Active cursor on line 2 would return
 * ```
 * {
 *     start: (2, 0),
 *     end: (2, 9),
 *     depth: 3,
 * }
 * ```
 */
export function getCurrentScope(textEditor: TextEditor) {
    const document = textEditor.document;
    const cursorPos = getCursorPosition();
    if (cursorPos === null) {
        return null;
    }

    const startOfScope = getStartOfCurrentScope(document, cursorPos);
    if (startOfScope === null) {
        return null;
    }

    const { startOfHeading, startPosition } = startOfScope;

    const start: Position = startPosition.with();

    const depth = Math.min(startOfHeading.length, MAX_HEADER_DEPTH);
    const headingRegExp = new RegExp(`^${HEADER_SYMBOL}{1,${depth}}(\\s+|$)`);

    let currPos: Position = startPosition.with();
    let currLine: string = "";
    let lastNonemptyLine: Position = currPos.with();
    for (let i = currPos.line; i < document.lineCount; i++) {
        currPos = currPos.translate(1, 0);
        if (currPos.line >= document.lineCount) {
            break;
        }

        currLine = getLine(document, currPos);

        if (headingRegExp.test(currLine)) {
            const end: Position = lastNonemptyLine;
            currLine = getLine(document, end);
            return new Scope(start, end.with({ character: currLine.length }), depth);
        } else if (currLine !== "") {
            lastNonemptyLine = currPos.with();
        }
    }

    const end = lastNonemptyLine;
    currLine = getLine(document, end);
    return new Scope(start, end.with({ character: currLine.length }), depth);
}

export function getCursorPosition() {
    const activeEditor = window.activeTextEditor;
    if (activeEditor === undefined) {
        return null;
    }

    return activeEditor.selection.active;
}

export function getCursorPositions() {
    const activeEditor = window.activeTextEditor;
    if (activeEditor === undefined) {
        return null;
    }

    return activeEditor.selections.map(selection => selection.active);
}

export type StartOfScope = {
    startOfHeading: string;
    startPosition: Position;
}
export function getStartOfCurrentScope(document: TextDocument, cursorPosition: Position) {
    let startOfScope: StartOfScope;
    
    let currPos: Position = cursorPosition.with({ character: 0 });
    let currLine = getLine(document, currPos);

    let startOfHeading = getStartOfHeading(currLine);

    if (startOfHeading !== null) {
        startOfScope = {
            startOfHeading,
            startPosition: currPos,
        }
        return startOfScope;
    }

    for (let i = cursorPosition.line; i > 0; i--) {
        currPos = currPos.translate(-1, 0);
        startOfHeading = getStartOfHeading(getLine(document, currPos));
        if (startOfHeading !== null) {
            startOfScope = {
                startOfHeading,
                startPosition: currPos,
            }
            return startOfScope;
        }
    }

    return null;
}

export function getStartOfHeading(line: string) {
    const startOfHeading = line.match(START_OF_HEADER_LINE_REGEX);
    if (startOfHeading === null) {
        return null;
    }

    return startOfHeading[0].trim();
}

export function getLine(document: TextDocument, position: Position) {
    return document.lineAt(position).text;
}

export function moveCursorToEndOfLine(editor: TextEditor, pos: Position) {
    const curLine = getLine(editor.document, pos);
    const endOfLine = curLine.length;
    const endOfLinePos = new Position(pos.line, endOfLine);
    editor.selections = [new Selection(endOfLinePos, endOfLinePos)];
}

type CharacterRange = {
    start: number;
    end: number;
}
export function characterRangeToRange(position: Position, characterRange: CharacterRange) {
    return new Range(
        position.with({ character: characterRange.start }),
        position.with({ character: characterRange.end }),
    );
}

export interface CheckboxPrefix {
    matchedBox: string;
    boxRange: CharacterRange;
    matchedSymbol: string;
    symbolRange: CharacterRange;
}
interface RegExpIdentifier {
    regex: RegExp;
}
export interface CheckboxIdentifier extends RegExpIdentifier {
    symbol: string;
}


export function findCheckboxPrefix(line: string, checkboxIdentifier: CheckboxIdentifier) {
    const match = line.match(checkboxIdentifier.regex);
    if (match === null) {
        return null;
    }

    const offset = match[1].length;
    const matchedBox = match[2];
    const matchedSymbol = match[4];
    const checkboxPrefix: CheckboxPrefix = {
        matchedBox,
        boxRange: {
            start: offset,
            end: offset + matchedBox.length
        },
        matchedSymbol,
        symbolRange: {
            start: offset + match[3].length,
            end: offset + match[3].length + matchedSymbol.length,
        }
    }

    return checkboxPrefix;
}

export function getCheckboxIdentifier() {
    const symbol = getCheckboxSymbol();
    const regex = getStartOfCheckboxRegEx(symbol);
    const identifier: CheckboxIdentifier = {
        symbol,
        regex,
    }
    return identifier;
}

function getStartOfCheckboxRegEx(checkboxSymbol: string) {
    return new RegExp(`^([ \\t]*)((- \\[)( |${escapeStringForRegExp(checkboxSymbol)})\\][ \\t]+)`);
}

function getCheckboxSymbol() {
    const checkboxSymbol = workspace.getConfiguration("markdownOrgMode").get<string>("checkboxSymbol");
    if (checkboxSymbol === undefined) {
        return "x";
    }

    return checkboxSymbol;
}

function escapeStringForRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}