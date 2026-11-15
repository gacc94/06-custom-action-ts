# 🚀 Custom TypeScript GitHub Action

An enterprise-grade Custom Action for **GitHub Actions** built with **TypeScript**, **Node.js 22+ (LTS)**, and **pnpm**, bundled into a self-contained runtime artifact using **esbuild** and executed on GitHub's `node24` runtime.

---

## 📋 Key Features

- ⚡ **Ultra-Fast Bundling:** Instant zero-overhead packaging with `esbuild` into a single standalone JavaScript file (`dist/index.js`).
- 🛡️ **Strict TypeScript:** Solution TSConfig setup (`tsconfig.json` shared base with `tsconfig.build.json` and `tsconfig.test.json`) leveraging `@actions/core` and `@actions/github`.
- 📦 **pnpm Package Manager:** Fast, deterministic dependency tree guarded by `allowBuilds` supply-chain policies (`pnpm-workspace.yaml`) and strict engine checks (`>=22.23.5`).
- 📊 **Rich Step Summary:** Renders a GitHub-flavored Markdown/HTML report (`$GITHUB_STEP_SUMMARY`) with a `[!TIP]` callout, clickable repository/commit links, runtime metadata table, and a collapsible JSON outputs inspector.
- 🧪 **Automated Unit Testing:** Test suite powered by Vitest 5 (`vitest.config.mts`) with V8 coverage reporting.
- 🔒 **Enterprise Governance:** Standardized with `.gitattributes`, `.editorconfig`, `.npmrc`, `commitlint` (Conventional Commits + required type emoji), `lefthook`, `SECURITY.md`, `LICENSE` (MIT), and `.github/CODEOWNERS`.

---

## 📥 Inputs

| Input      |     Required      | Default             | Description                                                           |
| :--------- | :---------------: | :------------------ | :-------------------------------------------------------------------- |
| `username` | **Yes** (runtime) | -                   | Name of the user triggering the pipeline (legacy alias: `usuario`)    |
| `role`     |        No         | `'DevOps Engineer'` | Role or execution profile in the infrastructure (legacy alias: `rol`) |

> **Note:** At least one of `username` or `usuario` must be provided at runtime; otherwise the action fails with a native workflow error annotation.

---

## 📤 Outputs

| Output      |       Type        | Description                            |
| :---------- | :---------------: | :------------------------------------- |
| `result`    |      String       | Consolidated execution summary message |
| `resultado` |      String       | Legacy alias for `result`              |
| `timestamp` | String (ISO 8601) | Precise UTC timestamp of the execution |

---

## 💡 Workflow Usage

### 1. Complete Workflow (From Another Repository)

Create `.github/workflows/greeter.yml` in any repository to invoke this action remotely:

```yaml
name: 🚀 Custom Greeter Workflow

on:
    workflow_dispatch:
        inputs:
            username:
                description: 'User triggering the workflow'
                required: true
                default: 'Gustavo'
            role:
                description: 'Execution role'
                required: false
                default: 'Lead Cloud Architect'
    push:
        branches: [main]

permissions:
    contents: read

jobs:
    greet:
        name: 👋 Run Custom TypeScript Action
        runs-on: ubuntu-latest
        steps:
            - name: 🚀 Invoke Custom Greeter Action
              id: greeter
              uses: gacc94/06-custom-action-ts@main
              with:
                  username: ${{ inputs.username || github.actor }}
                  role: ${{ inputs.role || 'DevOps Engineer' }}

            - name: 📋 Consume Step Outputs
              env:
                  ACTION_RESULT: ${{ steps.greeter.outputs.result }}
                  ACTION_TIMESTAMP: ${{ steps.greeter.outputs.timestamp }}
              run: |
                  echo "Result: ${ACTION_RESULT}"
                  echo "Timestamp: ${ACTION_TIMESTAMP}"
```

> **Production Recommendation:** Pin `uses:` to an immutable release tag (e.g., `gacc94/06-custom-action-ts@v1`) or a full commit SHA instead of `@main` for supply-chain immutability. Notice also that remote invocation does **not** require `actions/checkout` unless your own downstream steps need the repository source.

### 2. Local Invocation (Inside This Repository)

When testing or running the action within this same repository (as configured in [.github/workflows/test-action.yml](.github/workflows/test-action.yml)), you **must** run `actions/checkout` before `uses: ./` so the runner has access to `action.yml` and `dist/index.js`:

```yaml
jobs:
    verify-local-action:
        runs-on: ubuntu-latest
        steps:
            - name: 📥 Checkout repository
              uses: actions/checkout@v7

            - name: 🚀 Test local Custom Action
              id: test-action
              uses: ./
              with:
                  username: 'Gustavo'
                  role: 'Lead Cloud Architect'

            - name: 📋 Validate outputs
              env:
                  ACTION_RESULT: ${{ steps.test-action.outputs.result }}
                  ACTION_TIMESTAMP: ${{ steps.test-action.outputs.timestamp }}
              run: |
                  echo "Received: ${ACTION_RESULT} at ${ACTION_TIMESTAMP}"
```

### 3. Job Step Summary Output

After execution, the action automatically populates the workflow run's **Summary** tab (`$GITHUB_STEP_SUMMARY`) with:

- A `[!TIP]` callout displaying the generated greeting result.
- A metadata table showing **Status**, **User**, **Role**, clickable **Repository** and **Commit** links, **Branch / Ref**, **Node Runtime**, and **Timestamp (UTC)**.
- A collapsible **Raw Action Outputs (JSON)** `<details>` block containing `result`, `resultado`, and `timestamp`.

---

## 🛠️ Local Development

### Prerequisites

- **Node.js**: `>= 22.23.5` (Node.js 22 LTS minimum via `.nvmrc` / `.node-version`; executes on `node24` in GitHub Actions)
- **pnpm**: `12.16.1` (declared via `packageManager` in `package.json`)

### Lifecycle Commands

```bash
# 1. Install dependencies (and Lefthook Git hooks via prepare)
pnpm install

# 2. Check code formatting (Prettier) and lint rules (ESLint 10)
pnpm run format:check
pnpm run lint

# 3. Strict TypeScript type checking (build + test configs)
pnpm run type-check

# 4. Run unit tests & coverage report (Vitest 5)
pnpm test
pnpm run test:coverage

# 5. Clean, bundle, and generate source maps with esbuild (target: node22)
pnpm run build

# 6. Simulate local runner execution
OUT=$(mktemp)
SUM=$(mktemp)
INPUT_USERNAME="Gustavo" INPUT_ROLE="Lead Architect" GITHUB_OUTPUT="$OUT" GITHUB_STEP_SUMMARY="$SUM" node dist/index.js
cat "$SUM"
rm -f "$OUT" "$SUM"
```

### Commit Convention & Automated Releases

Commits are validated automatically via **Lefthook** + **Commitlint** ([commitlint.config.ts](commitlint.config.ts)) and require both Conventional Commits format and the designated leading emoji per type (for example: `feat: ✨ add new feature`, `docs: 📝 update README workflow examples`).

Releases and version tags are automated with **Release Please** ([.github/workflows/release.yml](.github/workflows/release.yml)):

- Pushing Conventional Commits to `main` opens or updates a **Release PR** that bumps `package.json` and updates `CHANGELOG.md`.
- Merging the Release PR (**Squash and merge** recommended) publishes the exact SemVer release/tag (e.g., `v1.0.0`) and automatically moves the floating major tag (`v1`) to that commit.

---

## 📄 License

Distributed under the [MIT](LICENSE) License.
