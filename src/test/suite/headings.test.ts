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

suite("Toggling between lines and heading", () => {
    test ("Should toggle lines and top level headings", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "# ",
                position: new Position(0, 0),
                finalPosition: new Position(0, 2),
            },
            {
                input: "# ",
                output: "",
                position: new Position(0, 2),
                finalPosition: new Position(0, 0),
            },
            {
                input: "   ",
                output: "#    ",
                position: new Position(0, 0),
                finalPosition: new Position(0, 2),
            },
            {
                input: "#    ",
                output: "   ",
                position: new Position(0, 2),
                finalPosition: new Position(0, 0),
            },
            {
                input: "Blah blah",
                output: "# Blah blah",
                position: new Position(0, 4),
                finalPosition: new Position(0, 6),
            },
            {
                input: "# Blah blah",
                output: "Blah blah",
                position: new Position(0, 6),
                finalPosition: new Position(0, 4),
            },
            {
                input: [
                    "# Blah blah",
                    "Blah blah 2",
                ],
                output: [
                    "# Blah blah",
                    "# Blah blah 2",
                ],
                position: new Position(1, 4),
                finalPosition: new Position(1, 6),
            },
            {
                input: [
                    "# Blah blah",
                    "# Blah blah 2",
                ],
                output: [
                    "# Blah blah",
                    "Blah blah 2",
                ],
                position: new Position(1, 6),
                finalPosition: new Position(1, 4),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.toggleLineAndHeading");
    });

    test("Should toggle lines and headings with correct scope depth", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: [
                    "## Blah blah 1.1",
                    ""
                ],
                output: [
                    "## Blah blah 1.1",
                    "## "
                ],
                position: new Position(1, 0),
                finalPosition: new Position(1, 3),
            },
            {
                input: [
                    "## Blah blah 1.1",
                    "## "
                ],
                output: [
                    "## Blah blah 1.1",
                    ""
                ],
                position: new Position(1, 3),
                finalPosition: new Position(1, 0),
            },
            {
                input: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    ""
                ],
                output: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "## "
                ],
                position: new Position(2, 0),
                finalPosition: new Position(2, 3),
            },
            {
                input: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "## "
                    
                ],
                output: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    ""
                ],
                position: new Position(2, 3),
                finalPosition: new Position(2, 0),
            },
            {
                input: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "Blah blah 1.2"
                ],
                output: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "## Blah blah 1.2"
                ],
                position: new Position(2, 4),
                finalPosition: new Position(2, 7),
            },
            {
                input: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "## Blah blah 1.2"
                ],
                output: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "Blah blah 1.2"
                ],
                position: new Position(2, 7),
                finalPosition: new Position(2, 4),
            },
            {
                input: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "content",
                    "content",
                    "content",
                    "Blah blah 1.2",
                    "content",
                    "content",
                ],
                output: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "content",
                    "content",
                    "content",
                    "## Blah blah 1.2",
                    "content",
                    "content",
                ],
                position: new Position(5, 4),
                finalPosition: new Position(5, 7),
            },
            {
                input: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "content",
                    "content",
                    "content",
                    "## Blah blah 1.2",
                    "content",
                    "content",
                ],
                output: [
                    "# Blah blah 1",
                    "## Blah blah 1.1",
                    "content",
                    "content",
                    "content",
                    "Blah blah 1.2",
                    "content",
                    "content",
                ],
                position: new Position(5, 7),
                finalPosition: new Position(5, 4),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.toggleLineAndHeading");
    });
});

suite("Tests Demoting Headings", () => {
    // not sure if there is a way to check that a window warning was issued
    // maybe mock `window.showWarningMessage`?
    test("Should fail to demote non-heading line", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "blah blah blah",
                output: "blah blah blah",
                position: new Position(0, 3),
                finalPosition: new Position(0, 3),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.demoteHeading");
    });

    test("Should demote heading lines up to the maximum depth", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "# Heading",
                output: "## Heading",
                position: new Position(0, 3),
                finalPosition: new Position(0, 4),
            },
            {
                input: "## Heading",
                output: "### Heading",
                position: new Position(0, 4),
                finalPosition: new Position(0, 5),
            },
            {
                input: "### Heading",
                output: "#### Heading",
                position: new Position(0, 5),
                finalPosition: new Position(0, 6),
            },
            {
                input: "#### Heading",
                output: "##### Heading",
                position: new Position(0, 6),
                finalPosition: new Position(0, 7),
            },
            {
                input: "##### Heading",
                output: "###### Heading",
                position: new Position(0, 7),
                finalPosition: new Position(0, 8),
            },
            {
                input: "###### Heading",
                output: "###### Heading", // stays the same
                position: new Position(0, 8),
                finalPosition: new Position(0, 8),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.demoteHeading");
    });
});

suite("Tests Promoting Headings", () => {
    test("Should fail to promote non-heading line", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "blah blah blah",
                output: "blah blah blah",
                position: new Position(0, 3),
                finalPosition: new Position(0, 3),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.promoteHeading");
    });

    test("Should promote heading lines up to the top-level depth", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "####### Heading",
                output: "###### Heading", // works even though this isn't technically a valid heading
                position: new Position(0, 8),
                finalPosition: new Position(0, 7),
            },
            {
                input: "###### Heading",
                output: "##### Heading",
                position: new Position(0, 8),
                finalPosition: new Position(0, 7),
            },
            {
                input: "##### Heading",
                output: "#### Heading",
                position: new Position(0, 7),
                finalPosition: new Position(0, 6),
            },
            {
                input: "#### Heading",
                output: "### Heading",
                position: new Position(0, 6),
                finalPosition: new Position(0, 5),
            },
            {
                input: "### Heading",
                output: "## Heading",
                position: new Position(0, 5),
                finalPosition: new Position(0, 4),
            },
            {
                input: "## Heading",
                output: "# Heading",
                position: new Position(0, 4),
                finalPosition: new Position(0, 3),
            },
            {
                input: "# Heading",
                output: "# Heading", // Can't promote any higher
                position: new Position(0, 3),
                finalPosition: new Position(0, 3),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.promoteHeading");
    });
});