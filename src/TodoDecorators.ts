import {
    window,
    TextEditor,
    TextEditorDecorationType,
    DecorationOptions,
    OverviewRulerLane,
    Position,
    Range,
} from "vscode";
import {
    HEADER_SYMBOL,
    TodoPriority,
    getTodoKeywordsWithPriority,
    convertKeywordToPriorityMap,
    escapeStringForRegExp,
} from "./utils";

export class TodoDecorators {
    timeout: NodeJS.Timeout | undefined;
    todoKeywords: string[] = [];
    todoKeywordPriorityMap: Record<string, TodoPriority> = {};
    activeTextEditor: TextEditor | undefined;
    matchedTodoKeywords: Record<TodoPriority, DecorationOptions[]> = {
        "high": [],
        "medium": [],
        "normal": [],
        "low": [],
    };
    todoDecorationTypes: Record<TodoPriority, TextEditorDecorationType>;

    constructor() {
        this.activeTextEditor = window.activeTextEditor;
        this.updateTodoKeywords();

        this.todoDecorationTypes = {
            "high": window.createTextEditorDecorationType({
                color: { id: "markdownOrgMode.highPriorityColor" },
                overviewRulerColor: { id: "markdownOrgMode.highPriorityColor" },
                overviewRulerLane: OverviewRulerLane.Right,
                fontStyle: "bold",
            }),
            "medium": window.createTextEditorDecorationType({
                color: { id: "markdownOrgMode.mediumPriorityColor" },
                overviewRulerColor: { id: "markdownOrgMode.mediumPriorityColor" },
                overviewRulerLane: OverviewRulerLane.Right,
                fontStyle: "bold",
            }),
            "normal": window.createTextEditorDecorationType({
                color: { id: "markdownOrgMode.normalPriorityColor" },
                overviewRulerColor: { id: "markdownOrgMode.normalPriorityColor" },
                overviewRulerLane: OverviewRulerLane.Right,
                fontStyle: "bold",
            }),
            "low": window.createTextEditorDecorationType({
                color: { id: "markdownOrgMode.lowPriorityColor" },
                overviewRulerColor: { id: "markdownOrgMode.lowPriorityColor" },
                overviewRulerLane: OverviewRulerLane.Right,
                fontStyle: "bold",
            }),
        }
    }

    updateTodoKeywords() {
        const keywords = getTodoKeywordsWithPriority();
        this.todoKeywordPriorityMap = convertKeywordToPriorityMap(keywords);
        this.todoKeywords = Object.keys(this.todoKeywordPriorityMap);
    }

    clearMatches() {
        this.matchedTodoKeywords["high"] = [];
        this.matchedTodoKeywords["medium"] = [];
        this.matchedTodoKeywords["normal"] = [];
        this.matchedTodoKeywords["low"] = [];
    }

    updateDecorations() {
        if (this.activeTextEditor === undefined) {
            return;
        }

        const re = new RegExp(`^(${HEADER_SYMBOL}+ )(${
            this.todoKeywords.map(escapeStringForRegExp).join("|")
        })(\\s|$)`, "gm");
        const text = this.activeTextEditor.document.getText();
        this.clearMatches();
        let match: RegExpExecArray | null;
        let offset: number;
        let matchedKeyword: string;
        let matchedKeywordPriority: TodoPriority;
        let startPos: Position;
        let endPos: Position;

        while ((match = re.exec(text)) !== null ) {
            offset = match.index + match[1].length;
            matchedKeyword = match[2];
            matchedKeywordPriority = this.todoKeywordPriorityMap[matchedKeyword];
            startPos = this.activeTextEditor.document.positionAt(offset);
            endPos = this.activeTextEditor.document.positionAt(offset + matchedKeyword.length);
            this.matchedTodoKeywords[matchedKeywordPriority].push({ range: new Range(startPos, endPos) });
        }

        this.activeTextEditor.setDecorations(this.todoDecorationTypes["high"],   this.matchedTodoKeywords["high"]);
        this.activeTextEditor.setDecorations(this.todoDecorationTypes["medium"], this.matchedTodoKeywords["medium"]);
        this.activeTextEditor.setDecorations(this.todoDecorationTypes["normal"], this.matchedTodoKeywords["normal"]);
        this.activeTextEditor.setDecorations(this.todoDecorationTypes["low"],    this.matchedTodoKeywords["low"]);
    }

    triggerUpdateDecorations() {
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = setTimeout(this.updateDecorations.bind(this), 200);
    }
}