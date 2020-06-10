import * as assert from "assert";
import {
    workspace,
    window,
    commands,
    TextEditor,
    Position,
    Selection,
} from "vscode";

export type CommandTestCase = {
    input: string | string[];
    output: string | string[];
    position: Position;
    finalPosition: Position;
}
export async function runTestCasesOnCommand(testCases: CommandTestCase[], command: string) {
    let maybeTextEditor: TextEditor | null;
    let textEditor: TextEditor;
    let testCase: CommandTestCase;
    for (let i = 0; i < testCases.length; i++) {
        testCase = testCases[i];
        maybeTextEditor = await getActiveTextEditor(testCase.input);
        if (maybeTextEditor === null) {
            assert.fail("No active text editor");
        }

        textEditor = maybeTextEditor;
        await runTestCaseOnCommand(textEditor, testCase, command, i);
    }
}

export async function runTestCaseOnCommand(
    textEditor: TextEditor,
    testCase: CommandTestCase,
    command: string,
    index?: number,
) {
    if (testCase.position !== undefined) {
        setCursorPosition(textEditor, testCase.position);
    }
    await commands.executeCommand(command);
    
    const expectedOutput = Array.isArray(testCase.output) ? testCase.output.join("\n") : testCase.output;
    const actualCursorPosition = textEditor.selection.active;
    const failMessage = getFailureMessage(testCase.position, index);


    assert.strictEqual(textEditor.document.getText(), expectedOutput, failMessage);
    assert.strictEqual(actualCursorPosition.line, testCase.finalPosition.line, failMessage);
    assert.strictEqual(actualCursorPosition.character, testCase.finalPosition.character, failMessage);
}

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