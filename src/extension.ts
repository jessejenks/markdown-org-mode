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
import {
    promoteTree,
    demoteTree,
} from "./trees";

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

    const demoteTreeCmd = commands.registerTextEditorCommand("markdownOrgMode.demoteTree", demoteTree);
    const promoteTreeCmd = commands.registerTextEditorCommand("markdownOrgMode.promoteTree", promoteTree);

    context.subscriptions.push(insertHeadingCmd);
    context.subscriptions.push(insertSubheadingCmd);

    context.subscriptions.push(toggleLineAndHeadingCmd);
    context.subscriptions.push(demoteHeadingCmd);
    context.subscriptions.push(promoteHeadingCmd);

    context.subscriptions.push(demoteTreeCmd);
    context.subscriptions.push(promoteTreeCmd);
}

export function deactivate() {}