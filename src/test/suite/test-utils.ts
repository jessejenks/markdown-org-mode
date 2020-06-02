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
    position: Position | Position[];
    finalPosition: Position | Position[];
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
    const failMessage = getFailureMessage(testCase.position, index);


    assert.strictEqual(textEditor.document.getText(), expectedOutput, failMessage);
    comparePositions(textEditor.selections, testCase.finalPosition, failMessage);
}

export function setCursorPosition(textEditor: TextEditor, position: Position | Position[]) {
    if (Array.isArray(position)) {
        textEditor.selections = position.map(pos => new Selection(pos, pos));
    } else {
        textEditor.selection = new Selection(position, position);
    }
}

export function getFailureMessage(position?: Position | Position[], index?: number) {
    let message: string = `Failed`;
    if (index !== undefined) {
        message += ` on index ${index}`
    }

    if (Array.isArray(position)) {
        message += ` at positions ${
            position.map(pos => `(${pos.line}, ${pos.character})`).join(", ")
        }`
    } else if (position !== undefined) {
        message += ` at position (${position.line}, ${position.character})`
    }
    return message;
}

function comparePositions(actualPositions: Selection[], expectedPosition: Position | Position[], failMessage: string) {
    if (Array.isArray(expectedPosition)) {
        if (!Array.isArray(actualPositions) || expectedPosition.length !== actualPositions.length) {
            assert.fail(failMessage);
        }

        for (let i = 0; i < actualPositions.length; i++) {
            assert.deepStrictEqual<Position>(actualPositions[i].active, expectedPosition[i], failMessage);
        }
    } else {
        assert.deepStrictEqual<Position>(actualPositions[0].active, expectedPosition, failMessage);
    }
}