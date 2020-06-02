import { Position, CommentAuthorInformation } from "vscode";
import {
    CommandTestCase,
    runTestCasesOnCommand,
} from "./test-utils";

suite("Tests Demoting Trees", () => {
    test("Should not demote any lines", async() => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "Blah",
                output: "Blah",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: [
                    "Blah blah",
                    "blah blah blah",
                ],
                output: [
                    "Blah blah",
                    "blah blah blah",
                ],
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.demoteTree");
    });

    test("Should demote single headings", async() => {
        const testCases: CommandTestCase[] = [
            {
                input: "# Heading",
                output: "## Heading",
                position: new Position(0, 0),
                finalPosition: new Position(0, 1),
            },
            {
                input: "## Heading",
                output: "### Heading",
                position: new Position(0, 1),
                finalPosition: new Position(0, 2),
            },
            {
                input: "### Heading",
                output: "#### Heading",
                position: new Position(0, 2),
                finalPosition: new Position(0, 3),
            },
            {
                input: "#### Heading",
                output: "##### Heading",
                position: new Position(0, 3),
                finalPosition: new Position(0, 4),
            },
            {
                input: "##### Heading",
                output: "###### Heading",
                position: new Position(0, 4),
                finalPosition: new Position(0, 5),
            },
            {
                input: "###### Heading",
                output: "###### Heading", // only demotes to max depth
                position: new Position(0, 5),
                finalPosition: new Position(0, 5),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.demoteTree");
    });

    test("Should demote trees", async() => {
        const testCases: CommandTestCase[] = [
            {
                input: [
                    "# Heading",
                    "content",
                    "## Subheading",
                    "content",
                    "### Subsubheading",
                    "content",
                ],
                output: [
                    "## Heading",
                    "content",
                    "### Subheading",
                    "content",
                    "#### Subsubheading",
                    "content",
                ],
                position: new Position(0, 0),
                finalPosition: new Position(0, 1),
            },
            {
                input: [
                    "## Heading",
                    "content",
                    "### Subheading",
                    "content",
                    "#### Subsubheading",
                    "content",
                ],
                output: [
                    "### Heading",
                    "content",
                    "#### Subheading",
                    "content",
                    "##### Subsubheading",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(0, 2),
            },
            {
                input: [
                    "### Heading",
                    "content",
                    "#### Subheading",
                    "content",
                    "##### Subsubheading",
                    "content",
                ],
                output: [
                    "#### Heading",
                    "content",
                    "##### Subheading",
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                position: new Position(0, 2),
                finalPosition: new Position(0, 3),
            },
            {
                input: [
                    "#### Heading",
                    "content",
                    "##### Subheading",
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                output: [
                    "##### Heading",
                    "content",
                    "###### Subheading",
                    "content",
                    "###### Subsubheading", // should not demote
                    "content",
                ],
                position: new Position(0, 3),
                finalPosition: new Position(0, 4),
            },
            {
                input: [
                    "##### Heading",
                    "content",
                    "###### Subheading",
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                output: [
                    "###### Heading",
                    "content",
                    "###### Subheading", // should not demote
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                position: new Position(0, 4),
                finalPosition: new Position(0, 5),
            },
            {
                input: [
                    "###### Heading",
                    "content",
                    "###### Subheading",
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                output: [
                    "###### Heading", // should not demote
                    "content",
                    "###### Subheading",
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                position: new Position(0, 5),
                finalPosition: new Position(0, 5),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.demoteTree");
    });

    test("Should demote trees with proper scope", async () => {
        const baseInput = [
            "# Heading 1",
            "content",
            "## Heading 1.1",
            "content",
            "### Heading 1.1.1",
            "content",
            "### Heading 1.1.2",
            "content",
            "## Heading 1.2",
            "content",
            "### Heading 1.2.1",
            "content",
            "### Heading 1.2.2",
            "content",
            "# Heading 2",
            "content",
            "## Heading 2.1",
            "content",
            "### Heading 2.1.1",
            "content",
            "### Heading 2.1.2",
            "content",
            "## Heading 2.2",
            "content",
            "### Heading 2.2.1",
            "content",
            "### Heading 2.2.2",
            "content",
        ];
        const testCases: CommandTestCase[] = [
            {
                input: baseInput,
                output: [
                    "## Heading 1",
                    "content",
                    "### Heading 1.1",
                    "content",
                    "#### Heading 1.1.1",
                    "content",
                    "#### Heading 1.1.2",
                    "content",
                    "### Heading 1.2",
                    "content",
                    "#### Heading 1.2.1",
                    "content",
                    "#### Heading 1.2.2",
                    "content",
                    // should only demote first section
                    "# Heading 2",
                    "content",
                    "## Heading 2.1",
                    "content",
                    "### Heading 2.1.1",
                    "content",
                    "### Heading 2.1.2",
                    "content",
                    "## Heading 2.2",
                    "content",
                    "### Heading 2.2.1",
                    "content",
                    "### Heading 2.2.2",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(0, 2),
            },
            {
                input: baseInput,
                output: [
                    "# Heading 1",
                    "content",
                    // only demote from here
                    "### Heading 1.1",
                    "content",
                    "#### Heading 1.1.1",
                    "content",
                    "#### Heading 1.1.2",
                    "content",
                    // to here
                    "## Heading 1.2",
                    "content",
                    "### Heading 1.2.1",
                    "content",
                    "### Heading 1.2.2",
                    "content",
                    "# Heading 2",
                    "content",
                    "## Heading 2.1",
                    "content",
                    "### Heading 2.1.1",
                    "content",
                    "### Heading 2.1.2",
                    "content",
                    "## Heading 2.2",
                    "content",
                    "### Heading 2.2.1",
                    "content",
                    "### Heading 2.2.2",
                    "content",
                ],
                position: new Position(2, 2),
                finalPosition: new Position(2, 3),
            },
            {
                input: baseInput,
                output: [
                    "# Heading 1",
                    "content",
                    "## Heading 1.1",
                    "content",
                    "### Heading 1.1.1",
                    "content",
                    "### Heading 1.1.2",
                    "content",
                    // only demote from here
                    "### Heading 1.2",
                    "content",
                    "#### Heading 1.2.1",
                    "content",
                    "#### Heading 1.2.2",
                    "content",
                    // to here
                    "# Heading 2",
                    "content",
                    "## Heading 2.1",
                    "content",
                    "### Heading 2.1.1",
                    "content",
                    "### Heading 2.1.2",
                    "content",
                    "## Heading 2.2",
                    "content",
                    "### Heading 2.2.1",
                    "content",
                    "### Heading 2.2.2",
                    "content",
                ],
                position: new Position(8, 2),
                finalPosition: new Position(8, 3),
            },
            {
                input: baseInput,
                output: [
                    "# Heading 1",
                    "content",
                    "## Heading 1.1",
                    "content",
                    "### Heading 1.1.1",
                    "content",
                    "### Heading 1.1.2",
                    "content",
                    "## Heading 1.2",
                    "content",
                    "### Heading 1.2.1",
                    "content",
                    "### Heading 1.2.2",
                    "content",
                    // from here
                    "## Heading 2",
                    "content",
                    "### Heading 2.1",
                    "content",
                    "#### Heading 2.1.1",
                    "content",
                    "#### Heading 2.1.2",
                    "content",
                    "### Heading 2.2",
                    "content",
                    "#### Heading 2.2.1",
                    "content",
                    "#### Heading 2.2.2",
                    "content",
                ],
                position: new Position(14, 1),
                finalPosition: new Position(14, 2),
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.demoteTree");
    });
});



suite("Tests Promoting Trees", () => {
    test("Should not promote any lines", async() => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "Blah",
                output: "Blah",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: [
                    "Blah blah",
                    "blah blah blah",
                ],
                output: [
                    "Blah blah",
                    "blah blah blah",
                ],
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.promoteTree");
    });

    test("Should promote single headings", async() => {
        const testCases: CommandTestCase[] = [
            {
                input: "###### Heading",
                output: "##### Heading",
                position: new Position(0, 6),
                finalPosition: new Position(0, 5),
            },
            {
                input: "##### Heading",
                output: "#### Heading",
                position: new Position(0, 5),
                finalPosition: new Position(0, 4),
            },
            {
                input: "#### Heading",
                output: "### Heading",
                position: new Position(0, 4),
                finalPosition: new Position(0, 3),
            },
            {
                input: "### Heading",
                output: "## Heading",
                position: new Position(0, 3),
                finalPosition: new Position(0, 2),
            },
            {
                input: "## Heading",
                output: "# Heading",
                position: new Position(0, 2),
                finalPosition: new Position(0, 1),
            },
            {
                input: "# Heading",
                output: "# Heading",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.promoteTree");
    });

    test("Should promote trees", async() => {
        const testCases: CommandTestCase[] = [
            {
                input: [
                    "#### Heading",
                    "content",
                    "##### Subheading",
                    "content",
                    "###### Subsubheading",
                    "content",
                ],
                output: [
                    "### Heading",
                    "content",
                    "#### Subheading",
                    "content",
                    "##### Subsubheading",
                    "content",
                ],
                position: new Position(0, 4),
                finalPosition: new Position(0, 3),
            },
            {
                input: [
                    "### Heading",
                    "content",
                    "#### Subheading",
                    "content",
                    "##### Subsubheading",
                    "content",
                ],
                output: [
                    "## Heading",
                    "content",
                    "### Subheading",
                    "content",
                    "#### Subsubheading",
                    "content",
                ],
                position: new Position(0, 3),
                finalPosition: new Position(0, 2),
            },
            {
                input: [
                    "## Heading",
                    "content",
                    "### Subheading",
                    "content",
                    "#### Subsubheading",
                    "content",
                ],
                output: [
                    "# Heading",
                    "content",
                    "## Subheading",
                    "content",
                    "### Subsubheading",
                    "content",
                ],
                position: new Position(0, 2),
                finalPosition: new Position(0, 1),
            },
            {
                input: [
                    "# Heading",
                    "content",
                    "## Subheading",
                    "content",
                    "### Subsubheading",
                    "content",
                ],
                output: [
                    "# Heading", // does not promote this line
                    "content",
                    "# Subheading", // but promotes tree
                    "content",
                    "## Subsubheading",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(0, 1),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.promoteTree");
    });

    test("Should promote trees with proper scope", async () => {
        const baseInput = [
            "# Heading 1",
            "content",
            "## Heading 1.1",
            "content",
            "### Heading 1.1.1",
            "content",
            "### Heading 1.1.2",
            "content",
            "## Heading 1.2",
            "content",
            "### Heading 1.2.1",
            "content",
            "### Heading 1.2.2",
            "content",
            "# Heading 2",
            "content",
            "## Heading 2.1",
            "content",
            "### Heading 2.1.1",
            "content",
            "### Heading 2.1.2",
            "content",
            "## Heading 2.2",
            "content",
            "### Heading 2.2.1",
            "content",
            "### Heading 2.2.2",
            "content",
        ];
        const testCases: CommandTestCase[] = [
            {
                input: baseInput,
                output: [
                    // promote from here
                    "# Heading 1", // does not promote line
                    "content",
                    "# Heading 1.1", // but promotes both subtrees
                    "content",
                    "## Heading 1.1.1",
                    "content",
                    "## Heading 1.1.2",
                    "content",
                    "# Heading 1.2", // including this one
                    "content",
                    "## Heading 1.2.1",
                    "content",
                    "## Heading 1.2.2",
                    "content",
                    // to here
                    "# Heading 2",
                    "content",
                    "## Heading 2.1",
                    "content",
                    "### Heading 2.1.1",
                    "content",
                    "### Heading 2.1.2",
                    "content",
                    "## Heading 2.2",
                    "content",
                    "### Heading 2.2.1",
                    "content",
                    "### Heading 2.2.2",
                    "content",
                ],
                position: new Position(0, 1),
                finalPosition: new Position(0, 1),
            },
            {
                input: baseInput,
                output: [
                    "# Heading 1",
                    "content",
                    // promote from here
                    "# Heading 1.1",
                    "content",
                    "## Heading 1.1.1",
                    "content",
                    "## Heading 1.1.2",
                    "content",
                    // to here
                    "## Heading 1.2",
                    "content",
                    "### Heading 1.2.1",
                    "content",
                    "### Heading 1.2.2",
                    "content",
                    "# Heading 2",
                    "content",
                    "## Heading 2.1",
                    "content",
                    "### Heading 2.1.1",
                    "content",
                    "### Heading 2.1.2",
                    "content",
                    "## Heading 2.2",
                    "content",
                    "### Heading 2.2.1",
                    "content",
                    "### Heading 2.2.2",
                    "content",
                ],
                position: new Position(2, 2),
                finalPosition: new Position(2, 1),
            },
            {
                input: baseInput,
                output: [
                    "# Heading 1",
                    "content",
                    "## Heading 1.1",
                    "content",
                    "## Heading 1.1.1", // promote here
                    "content",
                    "### Heading 1.1.2",
                    "content",
                    "## Heading 1.2",
                    "content",
                    "### Heading 1.2.1",
                    "content",
                    "### Heading 1.2.2",
                    "content",
                    "# Heading 2",
                    "content",
                    "## Heading 2.1",
                    "content",
                    "### Heading 2.1.1",
                    "content",
                    "### Heading 2.1.2",
                    "content",
                    "## Heading 2.2",
                    "content",
                    "### Heading 2.2.1",
                    "content",
                    "### Heading 2.2.2",
                    "content",
                ],
                position: new Position(4, 3),
                finalPosition: new Position(4, 2),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.promoteTree");
    });
});