import {
    workspace,
    window,
    TextEditor,
    Position,
    Selection,
} from "vscode";

export async function getActiveTextEditor(content: string | string[]) {
    if (Array.isArray(content)) {
        content = content.join("\n");
    }
    const document = await workspace.openTextDocument({ language: "markdown", content });
    await window.showTextDocument(document);
    if (window.activeTextEditor === undefined) {
        return null;
    }
    return window.activeTextEditor;
}

export function setCursorPosition(textEditor: TextEditor, position: Position) {
    textEditor.selection = new Selection(position, position);
}

export function getFailureMessage(position?: Position, index?: number) {
    return `Failed`
    + (
        index === undefined ? (
            ""
        ) : (
            ` on index ${index}`
        )
    )
    + (
        position === undefined ? (
            ""
        ) : (
            ` at position (${position.line}, ${position.character})`
        )
    );
}