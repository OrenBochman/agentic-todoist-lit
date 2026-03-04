- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements.
- [x] Scaffold the Project.
- [x] Customize the Project.
- [x] Install Required Extensions (only if explicitly listed by project setup info).
- [x] Compile the Project.
- [ ] Create and Run Task when needed for this workspace.
- [ ] Launch the Project (prompt for debug mode first).
- [ ] Ensure Documentation is Complete (README plus this file reference). Use the gen-docs-comments.prompt.md prompt if necessary.

- [ ] Add these features:
  - [x] dark/light mode toggler as  web component:
    - Theme behavior requirements (source of truth for implementation):
      - Default theme is `Light`.
      - Theme must always follow system preference via `prefers-color-scheme`.
      - Do not persist user theme preference in `localStorage` or any other storage.
      - Provide a visible global toggle in the top app toolbar/header.
      - If system theme changes while the app is open, UI should reflect the new system theme.
      - Toggle interactions must remain keyboard accessible and keep visible focus indicators in both themes.
      - Use centralized theme tokens/CSS custom properties for colors; avoid scattered hard-coded color values.
    - Acceptance criteria:
      - On first load, app starts from `Light` and then reflects system theme behavior.
      - With no persistence, reload uses current system preference behavior (no remembered user override).
      - Header toggle is present, operable with keyboard, and updates the rendered theme state.
  - [x] Add additional themes under settings menu.
  - [x] export and import the todos to a file, so that the user can save and load their progress across sessions.
  - [x] Add editing of task text and due date.
  - [ ] parser and ui for 
    - [ ] `+` for projects
    - [ ] `@` for contexts
    - [ ] `#` for tags and `#kb-` prefix for kanban columns
    - [ ] `{}` for due dates
    - [ ] (color code task date based on how soon it is, e.g. red for overdue, yellow for due within a week, green for due later)
  - Filtering by project, context, tag, or due date
  - Sorting by due date, project, context, or tag
  - Kanban view
  - Gantt view
  - Calendar view

Execution Guidelines
- Since we use lit lets use the philosophy of "everything is a web component". This means that we should strive to create reusable web components for each feature or UI element in the app. This will help us maintain a consistent design and make it easier to manage our codebase.
- We are now in a monorepo workspace. The root contains the wiki and the lit directory contains the todo app project. When executing tasks, ensure you are operating in the correct directory and context for the task at hand.
  - For project-specific tasks, navigate to the `lit` directory before executing commands or making changes.
  - For wiki-related tasks, operate in the root directory.
- Track progress using the available todo list tool and update after each step.
- Keep communication concise, avoid dumping command output, and mention skipped steps explicitly.
- Work from the project root, avoid unnecessary folders, and do not revert user changes.
- Only install VS Code extensions specified by get_project_setup_info.
- Prefer purposeful UI/UX decisions, avoid placeholder media, and implement only requested features.
- Completion criteria: project scaffolding + compile success, up-to-date README, maintained Copilot instructions/agents, and clear user directions for launching or debugging.
- Adding new features should be done using a feature branch, next test for the feature added, then code that makes the test pass, then a pull request with a clear description of the feature and its purpose by the reviewer agent.
- List all web components in the Readme with a brief description of their purpose and usage.


## Request for details

- You may be asked to explain certain features once they are implemented. These explanations will go into the wiki to document the system. Also the dev-team members are not frontend experts or are rust or just unfamiliar with this technology stack. 
- However it is best practice to understand the implementation details to quickly get up to speed on the project and be able to make informed decisions about future features and changes.