import { Position } from "vscode";
import {
    CommandTestCase,
    runTestCasesOnCommand,
} from "./test-utils";

suite("Tests Inserting Headings", () => {
    test("Should properly insert headings in documents with no existing headings", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "# ",
                position: new Position(0, 0),
                finalPosition: new Position(0, 2),
            },
            {
                input: [
                    "",
                    ""
                ],
                output: [
                    "# ",
                    "",
                ],
                position: new Position(0, 0),
                finalPosition: new Position(0, 2),
            },
            {
                input: "Blah blah blah",
                output: [
                    "Blah blah blah",
                    "# ",
                ],
                position: new Position(0, 5),
                finalPosition: new Position(1, 2),
            },
            {
                input: [
                    "Blah blah blah",
                    "",
                    "",
                ],
                output: [
                    "Blah blah blah",
                    "# ",
                    "",
                    "",
                ],
                position: new Position(0, 5),
                finalPosition: new Position(1, 2),
            }
        ]

        await runTestCasesOnCommand(testCases, "markdownOrgMode.insertHeading");
    });

    test("Should insert headings in documents with existing headings", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "# blah",
                output: [
                    "# blah",
                    "# ",
                ],
                position: new Position(0, 2),
                finalPosition: new Position(1, 2),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                    "# ",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(4, 2),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                    "## ",
                ],
                position: new Position(2, 1),
                finalPosition: new Position(4, 3),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 2",
                    "content",
                    "### 3",
                    "content",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 2",
                    "content",
                    "### 3",
                    "content",
                    "## "
                ],
                position: new Position(2, 1),
                finalPosition: new Position(6, 3),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "# ",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(6, 2),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "",
                    "",
                    "",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "# ",
                    "",
                    "",
                    "",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(6, 2),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.insertHeading");
    });
});

suite("Tests Inserting Subheadings", () => {
    test("Should insert subheadings in documents with existing headings", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "# blah",
                output: [
                    "# blah",
                    "## ",
                ],
                position: new Position(0, 2),
                finalPosition: new Position(1, 3),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                    "## ",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(4, 3),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 2",
                    "content again",
                    "### ",
                ],
                position: new Position(2, 1),
                finalPosition: new Position(4, 4),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 2",
                    "content",
                    "### 3",
                    "content",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 2",
                    "content",
                    "### 3",
                    "content",
                    "### "
                ],
                position: new Position(2, 1),
                finalPosition: new Position(6, 4),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "## ",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(6, 3),
            },
            {
                input: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "",
                    "",
                    "",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                output: [
                    "# 1",
                    "content",
                    "## 1.1",
                    "content",
                    "### 1.1.1",
                    "content",
                    "## ",
                    "",
                    "",
                    "",
                    "# 2",
                    "content",
                    "## 2.1",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(6, 3),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.insertSubheading");
    });

    test("Should only insert subheadings up to maximum depth", async () => {
        const baseInput = [
            "# Heading 1",
            "## Heading 1.1",
            "### Heading 1.1.1",
            "#### Heading 1.1.1.1",
            "##### Heading 1.1.1.1.1",
            "###### Heading 1.1.1.1.1.1",
            "###### Heading 1.1.1.1.1.2",
        ];

        const testCases: CommandTestCase[] = [
            {
                input: baseInput.slice(0, 1),
                output: [
                    ...baseInput.slice(0, 1),
                    "## ",
                ],
                position: new Position(0, 0),
                finalPosition: new Position(1, 3),
            },
            {
                input: baseInput.slice(0, 2),
                output: [
                    ...baseInput.slice(0, 2),
                    "### ",
                ],
                position: new Position(1, 0),
                finalPosition: new Position(2, 4),
            },
            {
                input: baseInput.slice(0, 3),
                output: [
                    ...baseInput.slice(0, 3),
                    "#### ",
                ],
                position: new Position(2, 0),
                finalPosition: new Position(3, 5),
            },
            {
                input: baseInput.slice(0, 4),
                output: [
                    ...baseInput.slice(0, 4),
                    "##### ",
                ],
                position: new Position(3, 0),
                finalPosition: new Position(4, 6),
            },
            {
                input: baseInput.slice(0, 5),
                output: [
                    ...baseInput.slice(0, 5),
                    "###### ",
                ],
                position: new Position(4, 0),
                finalPosition: new Position(5, 7),
            },
            {
                input: baseInput.slice(0, 6),
                output: [
                    ...baseInput.slice(0, 6),
                    "###### ", // should stop at 6
                ],
                position: new Position(5, 0),
                finalPosition: new Position(6, 7),
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.insertSubheading");
    });
});
