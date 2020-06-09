import { Position } from "vscode";
import {
    CommandTestCase,
    runTestCasesOnCommand,
} from "./test-utils";

suite("Tests Detecting Context", () => {
    test("Should not do anything when incrementing or decrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "Blah blah blah",
                output: "Blah blah blah",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: [
                    "Blah blah blah",
                    "Blah blah blah",
                    "Blah blah blah",
                ],
                output: [
                    "Blah blah blah",
                    "Blah blah blah",
                    "Blah blah blah",
                ],
                position: new Position(2, 4),
                finalPosition: new Position(2, 4),
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.incrementContext");
        await runTestCasesOnCommand(testCases, "markdownOrgMode.decrementContext");
    });
});

suite("Tests Modifying Checkbox Context", () => {
    test("Should check checkboxes when incrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "- [ ] ",
                output: "- [x] ",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "- [ ] Blah blah blah",
                output: "- [x] Blah blah blah",
                position: new Position(0, 10),
                finalPosition: new Position(0, 10),
            },
            {
                input: "     - [ ] Blah blah blah",
                output: "     - [x] Blah blah blah",
                position: new Position(0, 15),
                finalPosition: new Position(0, 15),
            },
            {
                input: "- [x] Blah blah blah", // already checked checkboxes will be unchanged
                output: "- [x] Blah blah blah",
                position: new Position(0, 10),
                finalPosition: new Position(0, 10),
            },
            {
                input: "     - [x] Blah blah blah",
                output: "     - [x] Blah blah blah",
                position: new Position(0, 15),
                finalPosition: new Position(0, 15),
            },
            {
                input: [
                    "Blah blah blah",
                    "- [ ] Blah blah blah",
                    "Blah blah blah",
                    "    - [ ] Blah blah blah",
                ],
                output: [
                    "Blah blah blah",
                    "- [x] Blah blah blah",
                    "Blah blah blah",
                    "    - [x] Blah blah blah",
                ],
                position: [
                    new Position(1, 5),
                    new Position(3, 8),
                ],
                finalPosition: [
                    new Position(1, 5),
                    new Position(3, 8),
                ],
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.incrementContext");
    });

    test("Should uncheck checkboxes when decrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "- [x] ",
                output: "- [ ] ",
                position: new Position(0, 0),
                finalPosition: new Position(0, 0),
            },
            {
                input: "- [x] Blah blah blah",
                output: "- [ ] Blah blah blah",
                position: new Position(0, 10),
                finalPosition: new Position(0, 10),
            },
            {
                input: "     - [x] Blah blah blah",
                output: "     - [ ] Blah blah blah",
                position: new Position(0, 15),
                finalPosition: new Position(0, 15),
            },
            {
                input: "- [ ] Blah blah blah", // already unchecked checkboxes will be unchanged
                output: "- [ ] Blah blah blah",
                position: new Position(0, 10),
                finalPosition: new Position(0, 10),
            },
            {
                input: "     - [ ] Blah blah blah",
                output: "     - [ ] Blah blah blah",
                position: new Position(0, 15),
                finalPosition: new Position(0, 15),
            },
            {
                input: [
                    "Blah blah blah",
                    "- [x] Blah blah blah",
                    "Blah blah blah",
                    "    - [x] Blah blah blah",
                ],
                output: [
                    "Blah blah blah",
                    "- [ ] Blah blah blah",
                    "Blah blah blah",
                    "    - [ ] Blah blah blah",
                ],
                position: [
                    new Position(1, 5),
                    new Position(3, 8),
                ],
                finalPosition: [
                    new Position(1, 5),
                    new Position(3, 8),
                ],
            }
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.decrementContext");
    });
});

suite("Tests Modifying Todo Context", () => {
    test("Should increment todo keywords when incrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "# ",
                output: "# TODO ",
                position: new Position(0, 2),
                finalPosition: new Position(0, 7),
            },
            {
                input: "# TODO ",
                output: "# DONE ",
                position: new Position(0, 4),
                finalPosition: new Position(0, 4),
            },
            {
                input: "# DONE ",
                output: "# ",
                position: new Position(0, 7),
                finalPosition: new Position(0, 2),
            },

            {
                input: "## ",
                output: "## TODO ",
                position: new Position(0, 3),
                finalPosition: new Position(0, 8),
            },
            {
                input: "## TODO ",
                output: "## DONE ",
                position: new Position(0, 5),
                finalPosition: new Position(0, 5),
            },
            {
                input: "## DONE ",
                output: "## ",
                position: new Position(0, 8),
                finalPosition: new Position(0, 3),
            },

            {
                input: "### ",
                output: "### TODO ",
                position: new Position(0, 4),
                finalPosition: new Position(0, 9),
            },
            {
                input: "### TODO ",
                output: "### DONE ",
                position: new Position(0, 6),
                finalPosition: new Position(0, 6),
            },
            {
                input: "### DONE ",
                output: "### ",
                position: new Position(0, 9),
                finalPosition: new Position(0, 4),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.incrementContext");
    });

    test("Should increment todo keywords with multiple cursors when incrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: [
                    "# ",
                    "## ",
                    "### ",
                ],
                output: [
                    "# TODO ",
                    "## TODO ",
                    "### TODO ",
                ],
                position: [
                    new Position(0, 2),
                    new Position(1, 3),
                    new Position(2, 4),
                ],
                finalPosition: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ]
            },
            {
                input: [
                    "# TODO ",
                    "## TODO ",
                    "### TODO ",
                ],
                output: [
                    "# DONE ",
                    "## DONE ",
                    "### DONE ",
                ],
                position: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ],
                finalPosition: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ]
            },
            {
                input: [
                    "# DONE ",
                    "## DONE ",
                    "### DONE ",
                ],
                output: [
                    "# ",
                    "## ",
                    "### ",
                ],
                position: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ],
                finalPosition: [
                    new Position(0, 2),
                    new Position(1, 3),
                    new Position(2, 4),
                ]
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.incrementContext");
    });

    test("Should decrement todo keywords when decrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "# ",
                output: "# DONE ",
                position: new Position(0, 2),
                finalPosition: new Position(0, 7),
            },
            {
                input: "# DONE ",
                output: "# TODO ",
                position: new Position(0, 4),
                finalPosition: new Position(0, 4),
            },
            {
                input: "# TODO ",
                output: "# ",
                position: new Position(0, 7),
                finalPosition: new Position(0, 2),
            },

            {
                input: "## ",
                output: "## DONE ",
                position: new Position(0, 3),
                finalPosition: new Position(0, 8),
            },
            {
                input: "## DONE ",
                output: "## TODO ",
                position: new Position(0, 5),
                finalPosition: new Position(0, 5),
            },
            {
                input: "## TODO ",
                output: "## ",
                position: new Position(0, 8),
                finalPosition: new Position(0, 3),
            },

            {
                input: "### ",
                output: "### DONE ",
                position: new Position(0, 4),
                finalPosition: new Position(0, 9),
            },
            {
                input: "### DONE ",
                output: "### TODO ",
                position: new Position(0, 6),
                finalPosition: new Position(0, 6),
            },
            {
                input: "### TODO ",
                output: "### ",
                position: new Position(0, 8),
                finalPosition: new Position(0, 3),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.decrementContext");
    });

    test("Should decrement todo keywords with multiple cursors when decrementing context", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: [
                    "# ",
                    "## ",
                    "### ",
                ],
                output: [
                    "# DONE ",
                    "## DONE ",
                    "### DONE ",
                ],
                position: [
                    new Position(0, 2),
                    new Position(1, 3),
                    new Position(2, 4),
                ],
                finalPosition: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ]
            },
            {
                input: [
                    "# DONE ",
                    "## DONE ",
                    "### DONE ",
                ],
                output: [
                    "# TODO ",
                    "## TODO ",
                    "### TODO ",
                ],
                position: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ],
                finalPosition: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ]
            },
            {
                input: [
                    "# TODO ",
                    "## TODO ",
                    "### TODO ",
                ],
                output: [
                    "# ",
                    "## ",
                    "### ",
                ],
                position: [
                    new Position(0, 7),
                    new Position(1, 8),
                    new Position(2, 9),
                ],
                finalPosition: [
                    new Position(0, 2),
                    new Position(1, 3),
                    new Position(2, 4),
                ]
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.decrementContext");
    });
});