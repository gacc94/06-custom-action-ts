# 🚀 Custom TypeScript GitHub Action

An enterprise-grade Custom Action for **GitHub Actions** built with **TypeScript**, **Node.js 22+ (LTS)**, and **pnpm**, bundled into a self-contained runtime artifact using **esbuild**.

---

## 📋 Key Features

- ⚡ **Ultra-Fast Bundling:** Instant zero-overhead packaging with `esbuild` into a single standalone JavaScript file (`dist/index.js`).
- 🛡️ **Strict TypeScript:** Fully typed implementation leveraging the official GitHub Actions Toolkit (`@actions/core`, `@actions/github`).
- 📦 **pnpm Package Manager:** Fast, deterministic, and isolated dependency tree guarded by `onlyBuiltDependencies` supply-chain policies.
- 📊 **Rich Step Summary:** Emits formatted Markdown tables and callouts directly to the GitHub Actions Job summary UI.
- 🧪 **Automated Unit Testing:** Test suite powered by Vitest 5 with dedicated configuration (`vitest.config.mts`) and isolated test types (`tsconfig.test.json`).
- 🔒 **Enterprise Governance:** Standardized with `.gitattributes`, `.editorconfig`, `.npmrc`, `SECURITY.md`, `LICENSE` (MIT), and `.github/CODEOWNERS`.

---

## 📥 Inputs

| Input      | Required | Default             | Description                                                    |
| :--------- | :------: | :------------------ | :------------------------------------------------------------- |
| `username` | **Yes**  | -                   | Name of the user triggering the pipeline (alias: `usuario`)    |
| `role`     |    No    | `'DevOps Engineer'` | Role or execution profile in the infrastructure (alias: `rol`) |

---

## 📤 Outputs

| Output      |       Type        | Description                                                 |
| :---------- | :---------------: | :---------------------------------------------------------- |
| `result`    |      String       | Consolidated execution summary message (alias: `resultado`) |
| `timestamp` | String (ISO 8601) | Precise timestamp of the execution                          |

---

## 💡 Usage Examples

### Basic Usage

```yaml
- name: 🚀 DevOps Greeter
  uses: ./
  with:
      username: 'Gustavo'
```

### Advanced Usage with Chained Outputs

```yaml
- name: 🚀 Invoke Custom Action
  id: greeter-step
  uses: ./
  with:
      username: 'Gustavo'
      role: 'Lead Cloud Architect'

- name: 📋 Consume Step Outputs
  run: |
      echo "Received result: ${{ steps.greeter-step.outputs.result }}"
      echo "Generated timestamp: ${{ steps.greeter-step.outputs.timestamp }}"
```

---

## 🛠️ Local Development

### Prerequisites

- **Node.js**: `>= 22.23.5` (Node.js 22 LTS latest stable minimum; `node24` runtime in `action.yml`)
- **pnpm**: `>= 9.0.0` (v12+ recommended)

### Lifecycle Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Run unit tests with Vitest
pnpm test

# 3. Generate unit test coverage report
pnpm run test:coverage

# 4. Static code analysis and linting with ESLint 10
pnpm run lint

# 5. Strict TypeScript type checking
pnpm run type-check

# 6. Clean, bundle, and generate source maps with esbuild (target: node22)
pnpm run build

# 7. Simulate local runner execution
export INPUT_USERNAME="Gustavo"
export INPUT_ROLE="Lead Architect"
export GITHUB_OUTPUT="/tmp/gh_output.txt"
export GITHUB_STEP_SUMMARY="/tmp/gh_summary.md"
touch $GITHUB_OUTPUT $GITHUB_STEP_SUMMARY
node dist/index.js
```

---

## 📄 License

Distributed under the [MIT](LICENSE) License.
