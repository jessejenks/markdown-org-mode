import {
    ExtensionContext,
    commands,
} from "vscode";
import {
    insertHeading,
    insertSubheading,
    toggleLineAndHeading,
    demoteHeading,
    promoteHeading,
} from "./headings";

export function activate(context: ExtensionContext) {
    const insertHeadingCmd = commands.registerTextEditorCommand("markdownOrgMode.insertHeading", insertHeading);
    const insertSubheadingCmd = commands.registerTextEditorCommand("markdownOrgMode.insertSubheading",
        insertSubheading,
    );

    const toggleLineAndHeadingCmd = commands.registerTextEditorCommand("markdownOrgMode.toggleLineAndHeading",
        toggleLineAndHeading,
    );
    const demoteHeadingCmd = commands.registerTextEditorCommand("markdownOrgMode.demoteHeading", demoteHeading);
    const promoteHeadingCmd = commands.registerTextEditorCommand("markdownOrgMode.promoteHeading", promoteHeading);

    context.subscriptions.push(insertHeadingCmd);
    context.subscriptions.push(insertSubheadingCmd);

    context.subscriptions.push(toggleLineAndHeadingCmd);
    context.subscriptions.push(demoteHeadingCmd);
    context.subscriptions.push(promoteHeadingCmd);
}

export function deactivate() {}