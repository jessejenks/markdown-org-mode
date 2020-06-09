# Change Log

All notable changes to the "markdown-org-mode" extension will be documented in
this file.

Based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

## 0.0.1
### Adds
- Inserting headings and subheadings.
- Toggling between lines and headings, with proper scoping.
- Promoting and demoting headings.
- Promoting and demoting entire heading sections (trees).
- Toggling between lines and checkboxes.
- User configuration options for specifying a "check" symbol. Defaults to `x`.
- Incrementing and decrementing "contexts".
    - For checkboxes
        - Incrementing means checking.
        - Decrementing means unchecking.
    - For headings
        - Incrementing means going to the next "todo" keyword or blank.
        - Decrementing means going to the previous "todo" keyword or blank.
- User configuration options for specifying "todo" keywords. Defaults are
    - `TODO`
    - `DONE`