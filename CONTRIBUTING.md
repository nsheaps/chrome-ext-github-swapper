# Contributing to GitHub Swapper

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** 18+ (we use Node.js 22)
- **mise** - Tool version manager ([install](https://mise.jdx.dev))
- **direnv** - Environment loader ([install](https://direnv.net))

### Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/nsheaps/chrome-ext-github-swapper.git
   cd chrome-ext-github-swapper
   ```

2. Allow direnv (one-time setup):

   ```bash
   direnv allow
   ```

   This will:

   - Install mise and tools automatically
   - Add `bin/` to your PATH
   - Notify you about dependency updates

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the extension:
   ```bash
   npm run build
   ```

## Development Workflow

### Available Commands

```bash
# Linting and formatting
npm run check          # Check code style
npm run format         # Auto-fix issues

# Testing
npm test              # Run test suite

# Building
npm run build         # Build to dist/
npm run package       # Create .zip for Chrome Web Store
npm run validate      # Run check + test + build

# Using mise
mise run check        # Same as npm run check
mise run build        # Same as npm run build
```

### Project Structure

```
.
├── .github/
│   ├── copilot-instructions.md   # AI assistant guidelines
│   └── workflows/                # CI/CD workflows
├── docs/
│   ├── PRD.md                    # Product requirements
│   └── specs/                    # Technical specifications
├── rc.d/                         # direnv initialization scripts
├── scripts/                      # Build and release scripts
├── icons/                        # Extension icons
├── [extension files]             # Main extension code
└── [config files]                # Tool configurations
```

### Code Style

- **JavaScript**: ES2022, use modern syntax
- **Formatting**: Prettier (automatic)
- **Linting**: ESLint (flat config)
- **Naming**: camelCase for variables, PascalCase for classes

### Making Changes

1. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style

3. Validate your changes:

   ```bash
   npm run validate
   ```

4. Commit with clear messages:

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with tab dedup"
   git commit -m "docs: update README"
   ```

5. Push and create a pull request

### Commit Message Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

## Testing

### Manual Testing

1. Build the extension:

   ```bash
   npm run build
   ```

2. Load in Chrome:

   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

3. Test your changes on GitHub:
   - Navigate to github.com
   - Try omnibox shortcuts (type `gh` in address bar)
   - Check user filter buttons on issues/PRs
   - Verify view switching on PRs
   - Test tab deduplication

### Automated Testing

Currently, we have minimal automated tests. Contributions to improve test coverage are welcome!

## CI/CD

### Workflows

- **CI / Build** - Builds and packages the extension
- **CI / Check** - Lints and formats code (auto-fixes on PR)
- **CI / Test** - Runs test suite
- **CD / Release** - Publishes releases (on tags)

### Auto-Fix on PR

The check workflow will automatically:

1. Run linting and formatting checks
2. If issues found, auto-fix them
3. Commit and push the fixes
4. Fail the workflow to notify you

This keeps the codebase clean without manual intervention.

## Release Process

Releases are automated via GitHub Actions:

1. Update version in `manifest.json`
2. Commit: `git commit -am "chore: bump version to 1.1.0"`
3. Tag: `git tag v1.1.0`
4. Push: `git push --tags`
5. CI creates release and uploads artifacts

## Chrome Web Store

First-time publication requires manual upload:

1. Build and package: `npm run build && npm run package`
2. Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
3. Upload `build/github-swapper-v*.zip`
4. Fill in store listing details
5. Submit for review

For automated releases, configure these secrets:

- `CHROME_EXTENSION_ID`
- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`

## Documentation

When adding features, update:

- `README.md` - User-facing documentation
- `docs/PRD.md` - Product requirements (if applicable)
- `docs/specs/technical-spec.md` - Technical details
- Code comments for complex logic

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and constructive

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE-PRIVATE).
