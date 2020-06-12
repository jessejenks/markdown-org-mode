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
const START_OF_HEADER_LINE_REG_EXP = new RegExp(`^${HEADER_SYMBOL}+( |\\t)`);

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
    const startOfHeading = line.match(START_OF_HEADER_LINE_REG_EXP);
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
export interface TodoPrefix {
    matchedKeyword: string | null;
    keywordRange: CharacterRange;
    keywordWithPaddingRange: CharacterRange;
}
export type Prefix = CheckboxPrefix | TodoPrefix;


interface RegExpIdentifier {
    regex: RegExp;
}
export interface CheckboxIdentifier extends RegExpIdentifier {
    symbol: string;
}
export interface TodoIdentifier extends RegExpIdentifier {
    keywords: string[];
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

const CHECKBOX_REGEXP = /^\S$/;
function getCheckboxSymbol() {
    const checkboxSymbol = workspace.getConfiguration("markdownOrgMode").get<string>("checkboxSymbol");
    if (checkboxSymbol === undefined || !CHECKBOX_REGEXP.test(checkboxSymbol)) {
        return "x";
    }

    return checkboxSymbol;
}

export function findTodoPrefix(line: string, todoIdentifier: TodoIdentifier) {
    const match = line.match(todoIdentifier.regex);
    if (match === null) {
        return null;
    }

    const offset = match[1].length;
    const matchedKeywordWithPadding = match[2] === undefined ? null : match[2];
    const matchedKeyword = match[3] === undefined ? null : match[3];

    const todoPrefix: TodoPrefix = {
        matchedKeyword,
        keywordRange: {
            start: offset + 1,
            end: offset + 1 + (matchedKeyword === null ? 0 : matchedKeyword.length),
        },
        keywordWithPaddingRange: {
            start: offset,
            end: offset + (matchedKeywordWithPadding === null ? 0 : matchedKeywordWithPadding.length),
        }
    }

    return todoPrefix;
}

export function getTodoIdentifier() {
    const keywords = getTodoKeywords();
    const regex = getStartOfTodoRegEx(keywords);
    const identifier: TodoIdentifier = {
        keywords,
        regex,
    }
    return identifier;
}

export function getTodoKeywords() {
    const todoKeywords = getTodoKeywordsWithPriority();
    return todoKeywords.map(stripPriority);
}

const KEYWORD_WITH_PRIORITY_REG_EXP = /^([A-Z][A-Z_]*:?)(\.(high|medium|low))?$/
export function stripPriority(keywordMaybeWithPriority: string) {
    const match = keywordMaybeWithPriority.match(KEYWORD_WITH_PRIORITY_REG_EXP);
    if (match === null) {
        return "";
    }
    return match[1];
}

export type TodoPriority = "high" | "medium" | "normal" | "low";
export function getTodoKeywordsWithPriority() {
    const todoKeywordsWithPriority = workspace.getConfiguration("markdownOrgMode").get<string[]>("todoKeywords");
    if (todoKeywordsWithPriority === undefined) {
        return [];
    }
    return todoKeywordsWithPriority.filter(keyword => KEYWORD_WITH_PRIORITY_REG_EXP.test(keyword));
}

export function convertKeywordToPriorityMap(todoKeywordsWithPriority: string[]) {
    let todoKeywordWithPriority: string;
    let todoKeyword: string;
    let match: RegExpMatchArray | null;
    let priority: TodoPriority;

    const mapping: Record<string, TodoPriority> = {};

    for (let i = 0; i < todoKeywordsWithPriority.length; i++) {
        todoKeywordWithPriority = todoKeywordsWithPriority[i];
        match = todoKeywordWithPriority.match(KEYWORD_WITH_PRIORITY_REG_EXP);
        if (match === null) {
            continue;
        }

        todoKeyword = match[1];
        priority = match[3] === undefined ? "normal" : match[3] as TodoPriority;
        mapping[todoKeyword] = priority;
    }

    return mapping;
}

export function getStartOfTodoRegEx(todoKeywords: string[]) {
    return new RegExp(`^(${HEADER_SYMBOL}+)( (${todoKeywords.join("|")}))?(\\s|$)`);
}

export function escapeStringForRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}