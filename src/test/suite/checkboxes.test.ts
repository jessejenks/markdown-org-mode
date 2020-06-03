import { Position } from "vscode";
import {
    CommandTestCase,
    runTestCasesOnCommand,
} from "./test-utils";

suite("Tests Toggling Checkboxes", () => {
    test("Should insert checkboxes", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "",
                output: "- [ ] ",
                position: new Position(0, 0),
                finalPosition: new Position(0, 6),
            },
            {
                input: "     ",
                output: "     - [ ] ",
                position: new Position(0, 5),
                finalPosition: new Position(0, 11),
            },
            {
                input: "     ",
                output: "     - [ ] ",
                position: new Position(0, 2),
                finalPosition: new Position(0, 2),
            },
            {
                input: "Blah",
                output: "- [ ] Blah",
                position: new Position(0, 3),
                finalPosition: new Position(0, 9),
            },
            {
                input: " \t  Blah",
                output: " \t  - [ ] Blah",
                position: new Position(0, 6),
                finalPosition: new Position(0, 12),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.toggleLineAndCheckbox");
    });

    test("Should remove checkboxes", async () => {
        const testCases: CommandTestCase[] = [
            {
                input: "- [ ] ",
                output: "",
                position: new Position(0, 6),
                finalPosition: new Position(0, 0),
            },
            {
                input: "     - [ ] ",
                output: "     ",
                position: new Position(0, 11),
                finalPosition: new Position(0, 5),
            },
            {
                input: "     - [ ] ",
                output: "     ",
                position: new Position(0, 2),
                finalPosition: new Position(0, 2),
            },
            {
                input: "- [ ] Blah",
                output: "Blah",
                position: new Position(0, 9),
                finalPosition: new Position(0, 3),
            },
            {
                input: " \t  - [ ] Blah",
                output: " \t  Blah",
                position: new Position(0, 12),
                finalPosition: new Position(0, 6),
            },
            {
                input: " \t  - [ ] \t Blah",
                output: " \t  Blah",
                position: new Position(0, 14),
                finalPosition: new Position(0, 6),
            },

            {
                input: "- [x] ",
                output: "",
                position: new Position(0, 6),
                finalPosition: new Position(0, 0),
            },
            {
                input: "     - [x] ",
                output: "     ",
                position: new Position(0, 11),
                finalPosition: new Position(0, 5),
            },
            {
                input: "     - [x] ",
                output: "     ",
                position: new Position(0, 2),
                finalPosition: new Position(0, 2),
            },
            {
                input: "- [x] Blah",
                output: "Blah",
                position: new Position(0, 9),
                finalPosition: new Position(0, 3),
            },
            {
                input: " \t  - [x] Blah",
                output: " \t  Blah",
                position: new Position(0, 12),
                finalPosition: new Position(0, 6),
            },
            {
                input: " \t  - [x] \t Blah",
                output: " \t  Blah",
                position: new Position(0, 14),
                finalPosition: new Position(0, 6),
            },
        ];

        await runTestCasesOnCommand(testCases, "markdownOrgMode.toggleLineAndCheckbox");
    });
});