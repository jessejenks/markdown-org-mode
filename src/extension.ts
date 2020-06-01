import {
    ExtensionContext,
    commands,
} from "vscode";
import {
    insertHeading,
    insertSubheading,
    toggleLineAndHeading,
} from "./headings";

export function activate(context: ExtensionContext) {
    const insertHeadingCmd = commands.registerTextEditorCommand("markdownOrgMode.insertHeading", insertHeading);
    const insertSubheadingCmd = commands.registerTextEditorCommand("markdownOrgMode.insertSubheading",
        insertSubheading,
    );

    const toggleLineAndHeadingCmd = commands.registerTextEditorCommand("markdown-org-mode.toggleLineAndHeading",
        toggleLineAndHeading,
    );
    context.subscriptions.push(insertHeadingCmd);
    context.subscriptions.push(insertSubheadingCmd);

    context.subscriptions.push(toggleLineAndHeadingCmd);
}

export function deactivate() {}