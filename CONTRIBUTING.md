# Contributing to Solana NeuroShield AI

Thank you for your interest in contributing to **Solana NeuroShield AI (SolShield)**! We welcome contributions from developers, security researchers, and Web3 enthusiasts across the global community.

This document provides guidelines and international standards for contributing to the repository.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Prerequisites & Development Setup](#prerequisites--development-setup)
3. [Branching Strategy](#branching-strategy)
4. [Conventional Commit Guidelines](#conventional-commit-guidelines)
5. [Code Style & Best Practices](#code-style--best-practices)
6. [Submitting a Pull Request](#submitting-a-pull-request)
7. [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to `surajdhawal.dev@gmail.com`.

---

## Prerequisites & Development Setup

### System Requirements

- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+)
- **Git**: v2.30+

### Quickstart

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/solana-neuroshield.git
   cd solana-neuroshield
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Verify TypeScript & Production Build**:
   ```bash
   npm run build
   ```

---

## Branching Strategy

We follow the standard Git Feature Branch workflow. Always create branches from `main`:

| Branch Prefix | Purpose | Example |
| :--- | :--- | :--- |
| `feat/` | New user-facing feature or capability | `feat/drainer-heuristic-v2` |
| `fix/` | Bug fix or error resolution | `fix/mobile-bottom-nav-padding` |
| `refactor/` | Code refactoring without behavior change | `refactor/wallet-state-hooks` |
| `perf/` | Performance optimizations | `perf/400ms-simulation-pipeline` |
| `docs/` | Documentation updates or guides | `docs/architecture-sequence-diagram` |
| `chore/` | Tooling, dependencies, or configuration | `chore/upgrade-tailwind-v4` |

---

## Conventional Commit Guidelines

We strictly adhere to the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) standard. Each commit message must follow this format:

```text
<type>(<scope>): <short description in imperative present tense>

[optional body providing technical context]

[optional footer(s) such as Closes #123]
```

### Allowed Types

- `feat`: A new feature for the user
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Changes that do not affect the meaning of the code (white-space, formatting)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, auxiliary tools, or libraries

### Examples

```bash
git commit -m "feat(security): implement token-2022 transfer-hook heuristic analysis"
git commit -m "fix(wallet): resolve rpc balance poll timeout on devnet fallback"
git commit -m "docs(readme): add interactive quickstart guide and architecture diagram"
```

---

## Code Style & Best Practices

1. **TypeScript First**:
   - Strict typing is enforced. Avoid using `any`; define explicit interfaces in `src/types/index.ts`.
   - Ensure `npm run build` (`tsc && vite build`) succeeds with zero errors or warnings before committing.

2. **React 19 & Component Architecture**:
   - Write functional components with clean React hooks.
   - Decouple business logic into dedicated services (`src/services/`).
   - Keep components modular, accessible (WCAG 2.1 AA compliant), and responsive across all device breakpoints.

3. **Tailwind CSS & Ergonomics**:
   - Use utility-first Tailwind classes adhering to the dark cyberpunk/Solana neon aesthetic (`#9945FF` and `#14F195`).
   - Ensure high contrast and mobile-friendly touch targets (min `44px x 44px`).

4. **Zero Disruptive Dialogs**:
   - Never use native browser `alert()` or `confirm()`. Use the built-in `useToast()` hook or custom glassmorphism modal dialogs.

---

## Submitting a Pull Request

1. **Ensure your branch is rebased on latest `main`**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Verify build & type checks**:
   ```bash
   npm run build
   ```

3. **Open a Pull Request**:
   - Use the provided [PR Template](.github/PULL_REQUEST_TEMPLATE.md).
   - Describe what problem your PR solves and attach screenshots or reproduction steps.
   - Link related issues using `Closes #issue_number`.

4. **Review & Merge**:
   - Maintainers will review your PR. At least one approval is required for merge.

---

## Security Vulnerabilities

Please **do not report security vulnerabilities via public GitHub issues**. Refer to our [Security Policy](SECURITY.md) for coordinated vulnerability disclosure procedures.
