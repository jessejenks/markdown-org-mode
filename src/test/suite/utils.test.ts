import * as assert from "assert";
import {
    TextEditor,
    Position,
} from "vscode";
import {
    setCursorPosition,
    getActiveTextEditor,
    getFailureMessage,
} from "./test-utils";
import {
    StartOfScope,
    Scope,
    getStartOfHeading,
    getStartOfCurrentScope,
    getCurrentScope,
} from "../../utils";


type HeaderTestCase = {
    input: string;
    output: string | null;
}

interface TestCase {
    input: string | string[];
    position: Position;
}
interface StartOfScopeTestCase extends TestCase {
    expectedStartOfScope: StartOfScope | null;
}
interface ScopeTestCase extends TestCase {
    expectedScope: Scope | null;
}

type TestCallback<T extends TestCase> = (textEditor: TextEditor, testCase: T, index: number) => void;

async function runTestCases<T extends TestCase>(testCases: T[], callback: TestCallback<T>) {
    let textEditor: TextEditor | null;
    let testCase: T;
    for (let i = 0; i < testCases.length; i++) {
        testCase = testCases[i];
        textEditor = await getActiveTextEditor(testCase.input);
        if (textEditor === null) {
            assert.fail("No active text editor");
        }

        if (testCase.position !== undefined) {
            setCursorPosition(textEditor, testCase.position);
        }

        callback(textEditor, testCase, i);
    }
}

function testStartOfScope(textEditor: TextEditor, testCase: StartOfScopeTestCase, index: number) {
    const scope = getStartOfCurrentScope(textEditor.document, testCase.position);
    assert.deepStrictEqual<StartOfScope | null>(
        scope,
        testCase.expectedStartOfScope,
        getFailureMessage(testCase.position, index)
    );
}

function testScope(textEditor: TextEditor, testCase: ScopeTestCase, index: number) {
    const scope = getCurrentScope(textEditor);
    assert.deepStrictEqual<Scope | null>(
        scope,
        testCase.expectedScope,
        getFailureMessage(testCase.position, index)
    );
}

suite("Tests Matching A Line As A Header", () => {
    test("Should not match lines which are not valid markdown headers", () => {
        const testCases: HeaderTestCase[] = [
            {
                input: "",
                output: null,
            },
            {
                input: "blah",
                output: null,
            },
            {
                input: "#",
                output: null,
            },
            {
                input: "#\n",
                output: null,
            },
            {
                input: " # Valid header but space at start",
                output: null,
            },
            {
                input: "#Invalid header",
                output: null,
            },
            {
                input: "##",
                output: null,
            },
            {
                input: " ## Valid header but space at start",
                output: null,
            },
            {
                input: "##Invalid header",
                output: null,
            }
        ];

        let testCase: HeaderTestCase;
        let startOfHeading: string | null;
        for (let i = 0; i < testCases.length; i++) {
            testCase = testCases[i];
            startOfHeading = getStartOfHeading(testCase.input);
            assert.deepStrictEqual(startOfHeading, testCase.output, `Failed on index ${i}`);
        }
    });

    test("Should match lines which are valid markdown headers", async () => {
        const testCases: HeaderTestCase[] = [
            {
                input: "# ",
                output: "#",
            },
            {
                input: "#\t",
                output: "#",
            },
            {
                input: "# Valid header",
                output: "#",
            },
            {
                input: "## Header",
                output: "##",
            },
            {
                input: "### Header",
                output: "###",
            },
        ];

        let testCase: HeaderTestCase;
        let startOfHeading: string | null;
        for (let i = 0; i < testCases.length; i++) {
            testCase = testCases[i];
            startOfHeading = getStartOfHeading(testCase.input);
            assert.deepStrictEqual(startOfHeading, testCase.output, `Failed on index ${i}`);
        }
    });
});

suite("Tests Finding Start Of Scope Of Given Position", () => {
    test("Should not find any start of scope", async () => {
        const testCases: StartOfScopeTestCase[] = [
            {
                input: "",
                position: new Position(0, 0),
                expectedStartOfScope: null,
            },
            {
                input: "blah blah",
                position: new Position(0, 0),
                expectedStartOfScope: null,
            },
            {
                input: [
                    "blah blah",
                    "blah blah",
                    "blah blah",
                ],
                position: new Position(1, 3),
                expectedStartOfScope: null,
            },
            {
                input: [
                    "blah blah",
                    "blah blah",
                    "blah blah",
                    "# next scope starts down here",
                ],
                position: new Position(1, 3),
                expectedStartOfScope: null,
            }
        ]
        
        await runTestCases(testCases, testStartOfScope);
    });
});

suite("Tests Finding Scope Surrounding Active Cursor Position", () => {
    test("Should not find any scope", async () => {
        const testCases: ScopeTestCase[] = [
            {
                input: "",
                position: new Position(0, 0),
                expectedScope: null,
            },
            {
                input: [
                    "blah blah",
                    "blah",
                    "blah blah"
                ],
                position: new Position(1, 3),
                expectedScope: null,
            },
            {
                input: [
                    "blah blah",
                    "blah",
                    "blah blah",
                    "# scope exists down here",
                    "blah blah",
                ],
                position: new Position(1, 3),
                expectedScope: null,
            },
        ];

        await runTestCases(testCases, testScope);
    });

    test("Should find the scope when basic headings exist", async () => {
        const testCases: ScopeTestCase[] = [
            {
                input: [
                    "# blah blah",
                    "blah",
                    "blah blah"
                ],
                position: new Position(1, 3),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(2, 9),
                    1,
                ),
            },
            {
                input: [
                    "# blah blah",
                    "blah",
                    "blah blah"
                ],
                position: new Position(1, 3),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(2, 9),
                    1,
                ),
            },
            {
                input: [
                    "# blah blah",
                    "blah",
                    "blah blah",
                    "",
                    "",
                ],
                position: new Position(1, 3),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(2, 9),
                    1,
                ),
            },
            {
                input: [
                    "# blah blah",
                    "blah",
                    "",
                    "",
                    "blah blah",
                    "",
                    "",
                ],
                position: new Position(1, 3),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(4, 9),
                    1,
                ),
            },
            {
                input: [
                    "# blah blah",
                    "blah",
                    "",
                    "",
                    "# blah blah",
                    "",
                    "",
                ],
                position: new Position(1, 4),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(1, 4),
                    1,
                ),
            },
            {
                input: [
                    "# blah blah",
                    "# blah blah",
                ],
                position: new Position(0, 4),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(0, 11),
                    1,
                ),
            },
        ];

        await runTestCases(testCases, testScope);
    });

    test("Should find the scope when multiple headings exist", async () => {
        const testCases: ScopeTestCase[] = [
            {
                input: [
                    "# 1",
                    "## 1.1",
                    "### 1.1.1",
                    "# 2",
                    "## 2.1",
                    "### 2.1.1",
                    "### 2.1.2",
                ],
                position: new Position(0, 3),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(2, 9),
                    1,
                ),
            },
            {
                input: [
                    "# 1",
                    "## 1.1",
                    "### 1.1.1",
                    "# 2",
                    "## 2.1",
                    "### 2.1.1",
                    "### 2.1.2",
                ],
                position: new Position(2, 3),
                expectedScope: new Scope(
                    new Position(2, 0),
                    new Position(2, 9),
                    3,
                ),
            },
            {
                input: [
                    "# blah blah",
                    "blah",
                    "",
                    "",
                    "## blah blah",
                    "### blah blah",
                    "content",
                    "",
                ],
                position: new Position(1, 3),
                expectedScope: new Scope(
                    new Position(0, 0),
                    new Position(6, 7),
                    1,
                ),
            },
            {
                input: [
                    "",
                    "content",
                    "# blah blah",
                    "blah",
                    "",
                    "",
                    "## blah blah",
                    "### blah blah",
                    "content",
                    "",
                ],
                position: new Position(2, 6),
                expectedScope: new Scope(
                    new Position(2, 0),
                    new Position(8, 7),
                    1,
                ),
            },
            {
                input: [
                    "",
                    "content",
                    "# blah blah",
                    "blah",
                    "",
                    "",
                    "## blah blah",
                    "### blah blah",
                    "content",
                    "",
                ],
                position: new Position(6, 3),
                expectedScope: new Scope(
                    new Position(6, 0),
                    new Position(8, 7),
                    2,
                ),
            }
        ];

        await runTestCases(testCases, testScope);
    });
});