import {
    window,
    TextEditor,
    TextEditorEdit,
    Position,
    Range,
} from "vscode";
import {
    TodoPrefix,
    CheckboxPrefix,
    Prefix,
    TodoIdentifier,
    CheckboxIdentifier,
    getLine,
    findTodoPrefix,
    findCheckboxPrefix,
    getTodoIdentifier,
    getCheckboxIdentifier,
    getCursorPositions,
    characterRangeToRange,
} from "./utils";

enum ModifyContextAction {
    Up,
    Down,
}
enum ContextType {
    Todo,
    Checkbox,
}

type ContextIdentifiers = {
    [ContextType.Todo]: TodoIdentifier;
    [ContextType.Checkbox]: CheckboxIdentifier;
}

type TodoContext = {
    type: ContextType.Todo;
    prefix: TodoPrefix;
}
type CheckboxContext = {
    type: ContextType.Checkbox;
    prefix: CheckboxPrefix;
}
type Context = TodoContext | CheckboxContext;


export function incrementContext(textEditor: TextEditor, edit: TextEditorEdit) { 
    modifyContext(textEditor, edit, ModifyContextAction.Up);
}

export function decrementContext(textEditor: TextEditor, edit: TextEditorEdit) {
    modifyContext(textEditor, edit, ModifyContextAction.Down);
}

function modifyContext(textEditor: TextEditor, edit: TextEditorEdit, action: ModifyContextAction) {
    const cursorPositions = getCursorPositions();
    if (cursorPositions === null) {
        return;
    }

    const contextIdentifiers: ContextIdentifiers = {
        [ContextType.Todo]: getTodoIdentifier(),
        [ContextType.Checkbox]: getCheckboxIdentifier(),
    }

    let cursorPos: Position;
    let currentLine: string;
    let currentContext: Context | null;
    let noContextsFound: boolean = true;

    for (let i = 0; i < cursorPositions.length; i++) {
        cursorPos = cursorPositions[i];
        currentLine = getLine(textEditor.document, cursorPos);
        currentContext = getCurrentContext(currentLine, contextIdentifiers);

        if (currentContext ===  null) {
            continue;
        }

        switch (currentContext.type) {
            case ContextType.Todo:
                modifyTodoContext(edit, action, cursorPos, currentContext.prefix, contextIdentifiers[ContextType.Todo]);
                noContextsFound = false;
                break;
            case ContextType.Checkbox:
                modifyCheckboxContext(edit, action, cursorPos, currentContext.prefix, contextIdentifiers[ContextType.Checkbox]);
                noContextsFound = false;
                break;
        }
    }

    if (noContextsFound) {
        const actionString = action === ModifyContextAction.Up ? "increment" : "decrement";
        window.showWarningMessage("Nothing to " + actionString);
    }
}

function getCurrentContext(line: string, contextIdentifiers: ContextIdentifiers) {
    let context: Context | null = null;
    let prefix: Prefix | null = null;

    if ((prefix = findTodoPrefix(line, contextIdentifiers[ContextType.Todo])) !== null) {
        context = {
            type: ContextType.Todo,
            prefix,
        }
    } else if ((prefix = findCheckboxPrefix(line, contextIdentifiers[ContextType.Checkbox])) !== null) {
        context = {
            type: ContextType.Checkbox,
            prefix
        }
    }

    return context;
}

function modifyTodoContext(
    edit: TextEditorEdit,
    action: ModifyContextAction,
    position: Position,
    todoPrefix: TodoPrefix,
    todoIdentifier: TodoIdentifier,
) {
    const next = getNextTodoKeyword(todoPrefix.matchedKeyword, todoIdentifier.keywords, action);
    const range = characterRangeToRange(position, todoPrefix.keywordWithPaddingRange);
    addOrRemoveKeyword(edit, range, todoPrefix.matchedKeyword, next);
}

function addOrRemoveKeyword(
    edit: TextEditorEdit,
    range: Range,
    oldTodoKeyword: string | null,
    newTodoKeyword: string | null
) {
    if (oldTodoKeyword === null) {
        edit.insert(range.start, " " + (newTodoKeyword || ""));
        return;
    }

    if (newTodoKeyword === null) {
        edit.delete(range);
        return;
    }

    edit.replace(range, " " + newTodoKeyword);
}

function getNextTodoKeyword(keyword: string | null, todoKeywords: string[], action: ModifyContextAction) {
    if (keyword === null) {
        return action === ModifyContextAction.Up ? todoKeywords[0] : todoKeywords[todoKeywords.length - 1];
    }

    const keywordIndex = todoKeywords.indexOf(keyword);
    if (keywordIndex < 0) {
        return action === ModifyContextAction.Up ? todoKeywords[0] : todoKeywords[todoKeywords.length - 1];
    }

    return action === ModifyContextAction.Up ? (
        keywordIndex == todoKeywords.length - 1 ? null : todoKeywords[(keywordIndex + 1) % todoKeywords.length]
    ) : (
        keywordIndex == 0 ? null : todoKeywords[keywordIndex - 1]
    );
}

function modifyCheckboxContext(
    edit: TextEditorEdit,
    action: ModifyContextAction,
    position: Position,
    checkboxPrefix: CheckboxPrefix,
    checkboxIdentifier: CheckboxIdentifier,
) {
    const next = getNextCheckboxSymbol(checkboxIdentifier.symbol, action);
    const range = characterRangeToRange(position, checkboxPrefix.symbolRange);
    edit.replace(range, next);
}

function getNextCheckboxSymbol(symbol: string, action: ModifyContextAction) {
    if (action === ModifyContextAction.Up) {
        return symbol;
    }

    return " ";
}
