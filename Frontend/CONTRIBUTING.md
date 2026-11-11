# 🤝 Contributing to Portfolio UI

Thank you for your interest in contributing to **Portfolio UI**! 🎉  
We welcome all kinds of contributions — bug fixes, new features, documentation improvements, and more.

Please take a moment to read these guidelines before you start.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Getting Started](#-getting-started)
- [Branch Naming](#-branch-naming)
- [Commit Messages](#-commit-messages)
- [Pull Request Process](#-pull-request-process)
- [Code Style](#-code-style)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)

---

## 📜 Code of Conduct

By participating in this project you agree to be respectful, inclusive, and constructive in all interactions.  
Harassment, discrimination, or any form of disrespectful behaviour will not be tolerated.

---

## 💡 How Can I Contribute?

| Type | Examples |
|------|---------|
| 🐛 Bug fix | Fix a broken animation, resolve a layout issue |
| ✨ New feature | Add a new section, integrate a new library |
| 📝 Documentation | Improve README, add code comments |
| 🎨 UI/UX | Improve accessibility, refine styles |
| 🧪 Tests | Add or improve unit/integration tests |
| ♻️ Refactor | Clean up code without changing behaviour |

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub.

2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/portfilo-ui.git
   cd portfilo-ui
   ```

3. **Install** dependencies:
   ```bash
   npm install
   ```

4. **Create a feature branch** (see [Branch Naming](#-branch-naming)):
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

5. **Start** the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`.

6. Make your changes, then **commit** and **push**:
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   git push origin feature/my-awesome-feature
   ```

7. **Open a Pull Request** against the `main` branch.

---

## 🌿 Branch Naming

Use the following prefixes to keep branches organised:

| Prefix | When to use |
|--------|-------------|
| `feature/` | New features (`feature/dark-mode-toggle`) |
| `fix/` | Bug fixes (`fix/navbar-scroll-bug`) |
| `docs/` | Documentation changes (`docs/update-readme`) |
| `refactor/` | Code refactoring (`refactor/hero-component`) |
| `test/` | Adding or updating tests (`test/contact-form`) |
| `chore/` | Tooling or dependency updates (`chore/update-angular`) |

---

## ✍️ Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(projects): add technology filter to projects page
fix(hero): resolve particle animation on mobile Safari
docs: update getting-started section in README
```

---

## 🔍 Pull Request Process

1. Ensure your branch is up to date with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Verify the build passes locally:
   ```bash
   npm run build
   ```

3. Run tests before submitting:
   ```bash
   npm test
   ```

4. Fill out the PR template completely — describe **what** changed and **why**.

5. Request a review from a maintainer.

6. Address any review feedback promptly.

7. Once approved, a maintainer will merge your PR.

---

## 🎨 Code Style

- Use **standalone components** (Angular 17 pattern) — no `NgModule`.
- Follow the [Angular Style Guide](https://angular.io/guide/styleguide).
- Use **TypeScript strict mode** — avoid `any` where possible.
- Implement **lazy loading** for all feature routes.
- Use **BEM methodology** for CSS class names.
- Write **semantic HTML** and ensure keyboard accessibility.
- Keep components small and single-responsibility.

---

## 🐛 Reporting Bugs

1. Search [existing issues](https://github.com/ZainulabdeenOfficial/portfilo-ui/issues) to avoid duplicates.
2. Open a new issue and include:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs. actual behaviour
   - Browser / OS / Node.js version
   - Screenshots or error logs if available

---

## 💬 Suggesting Features

1. Search [existing issues](https://github.com/ZainulabdeenOfficial/portfilo-ui/issues) first.
2. Open a new issue with the label `enhancement` and include:
   - A clear description of the feature
   - The problem it solves
   - Any implementation ideas you have

---

## 📞 Need Help?

- Open an issue on GitHub
- Start a discussion in the [Discussions](https://github.com/ZainulabdeenOfficial/portfilo-ui/discussions) tab
- Reach out to the maintainer: [@ZainulabdeenOfficial](https://github.com/ZainulabdeenOfficial)

---

Thank you for making **Portfolio UI** better! 🚀
