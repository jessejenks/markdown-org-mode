# Markdown Org Mode

`markdown-org-mode` is an extension for Visual Studio Code directly inspired by
the wonderful `org-mode` extension. If you are looking for a better maintained
and more established extension or are a die-hard emacs fan, I would recommend
using their extension instead.

The `org-mode` extension can be found on:
- [Github](https://github.com/vscode-org-mode/vscode-org-mode)
- [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=vscode-org-mode.org-mode)

## Motivation
I really love how easy `org-mode` is to use and soon after discovering it I was
exclusively writing all of my notes and todo lists using this extension. But for
a lot of my purposes, I missed being able to use the many tools that already
work with markdown. I even worked on a "markdown mode" fork of the original
extension, but this felt antithetical to their project. So instead, I decided to
make a hybrid extension which used markdown syntax but incorporated a lot of
their awesome features.

## Note
I intentionally did not include and keybindings for any commands. So you will
have to set these up yourself. This can be done by going to `Preferences >
Keyboard Shortcuts`, searching for the commands you want, and setting your
preferred shortcuts. I chose to do this because I think most people will have
their own preferences about what feels more natural for each command and will
change whatever shortcuts I chose anyway, so why bother pushing my preferences
onto them out of the box?

## Usage and Examples
This first release includes commands related to headings and checkboxes. Here
are a few examples. For more detailed examples please see the test files. For a
list of all commands please see the `package.json` file under `"commands"`.

### Inserting headings and subheadings
These commands let you easily insert your next section heading.

Inserting a heading with the cursor on the first or second line of this file
```markdown
# Section 3
paragraph
## Section 3.1
paragraph
### Section 3.1.4
paragraph
## Section 3.2
paragraph
```
will result in
```markdown
# Section 3
paragraph
## Section 3.1
paragraph
### Section 3.1.4
paragraph
## Section 3.2
paragraph
# 
```
moving your cursor onto the last line. But inserting a heading when your cursor
is on lines 3 or 4 will result in
```markdown
# Section 3
paragraph
## Section 3.1
paragraph
### Section 3.1.4
paragraph
## 
## Section 3.2
paragraph
```

### Easily adding TODO items
Once you've inserted a heading, you can turn it into a todo item with the
**increment context** command.

Running this command on this line
```markdown
# Important Thing I must do
```
will result in
```markdown
# TODO Important Thing I must do
```
Running it again will produce
```markdown
# DONE Important Thing I must do
```
And running it one last time will bring you back to the original line.

### Customizing the Todo keywords
The todo keywords shown in the previous example are just the defaults. You can
change the list of todo keywords by going to your setting pane and searching for
`Markdown Org Mode`.

### Promoting and Demoting heading trees
If you want a section and its subsections to have its 

Demoting when the cursor is on the first line
```markdown
# Section 3
## Section 3.1
### Section 3.1.4
```
will result in
```markdown
## Section 3
### Section 3.1
#### Section 3.1.4
```
Promoting will reverse this effect.