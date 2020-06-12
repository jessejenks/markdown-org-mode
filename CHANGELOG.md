# Change Log

All notable changes to the "markdown-org-mode" extension will be documented in
this file.

Based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

## [0.1.0] - 2020-06-12
### Added
- Decorators for highlighting keywords by priority.
- Theme-able colors corresponding to each priority level.

### Changed
- Todo keyword formatting. Now allows for specifying a priority.

### Fixed
- Changed "Adds" to "Added" in version 0.0.1 release notes per
"Keep a Changelog" guidelines.

## [0.0.1] - 2020-06-11
### Added
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

[0.1.0]: https://github.com/jessejenks/markdown-org-mode/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/jessejenks/markdown-org-mode/releases/tag/v0.0.1