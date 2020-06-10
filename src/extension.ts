import {
    ExtensionContext,
    commands,
} from "vscode";
import {
    insertHeading,
    insertSubheading,
} from "./headings";

export function activate(context: ExtensionContext) {
    const insertHeadingCmd = commands.registerTextEditorCommand("markdownOrgMode.insertHeading", insertHeading);
    const insertSubheadingCmd = commands.registerTextEditorCommand("markdownOrgMode.insertSubheading",
        insertSubheading,
    );

    context.subscriptions.push(insertHeadingCmd);
    context.subscriptions.push(insertSubheadingCmd);

}

export function deactivate() {}