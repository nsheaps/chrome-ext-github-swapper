# GitHub Copilot Instructions

This repository follows specific patterns and conventions. Please adhere to the following guidelines:

## License

- Always use a **private/proprietary license** unless explicitly specified otherwise
- Even for public repositories, default to private licensing

## Development Setup

- **mise** is used for tool version management (`.mise.toml`)
- **direnv** with `.envrc` loads scripts from `rc.d/` directory
- Scripts in `rc.d/` handle:
  - Tool auto-installation (`00-mise.sh`)
  - PATH configuration (`10-path.sh`)
  - Dependency notifications (`20-npm-install.sh`)
- Add executable scripts to `bin/` directory

## Project Structure

- Use **npm** with Node.js for TypeScript/JavaScript projects
- Organize mono-repos with workspaces when applicable
- Scripts follow naming: `check`, `test`, `build`, `format`, `validate`

## CI/CD Workflows

All projects must have GitHub Actions workflows:

- **ci / build** - Build the project
- **ci / check** - Linting and formatting (with auto-fix capability)
- **ci / test** - Run test suites
- **cd / release** - Release automation (if applicable)

### CI Triggers

- Trigger on **push to main** OR **any pull request**
- Avoid duplicate runs (don't target same branch twice)

### Auto-Fix Behavior

- CI check workflow should auto-fix linting/formatting errors
- Push fixes back to the branch
- Fail after fixing to notify of the changes
- Configurable via `AUTO_FIX_ENABLED` repository variable

## Code Style

- Use **Prettier** for formatting: `.md`, `.js`, `.jsx`, `.json`, `.ts`, `.tsx`, `.html`
- Use **ESLint** for JavaScript/TypeScript linting
- Configuration files:
  - `.prettierrc.json`
  - `eslint.config.js` (flat config format)

## Documentation

Organize documentation in structured folders:

- `docs/` - General documentation
- `docs/specs/` - Specifications and requirements
- `docs/research/` - Research and investigation notes

## Technology Preferences

1. TypeScript (via Bun) > TypeScript (via Node.js) > Go > Python
2. Choose language based on ecosystem:
   - Homebrew → Ruby
   - Kubernetes → Go
   - Web Extensions → JavaScript
3. Prefer methods that don't require compilation when possible

## Session Learning

- Update these instructions based on learnings during sessions
- Set up Copilot instructions on new repositories
- Maintain consistency across projects

## Current Project: GitHub Swapper Extension

- Chrome extension for GitHub navigation
- Features: shortcuts, user filters, view switching, tab deduplication
- Build: Copy files to `dist/`
- Package: Create `.zip` for Chrome Web Store
- All features configurable via settings page
