import { getInput, info, setFailed, setOutput, summary } from '@actions/core';
import { context } from '@actions/github';

import { escapeHtml, generateResultMessage } from './greeter';

async function run(): Promise<void> {
    try {
        // 1. Retrieve inputs declared in action.yml (primary English with legacy fallback)
        const username = getInput('username') || getInput('usuario') || getInput('username', { required: true });
        const role = getInput('role') || getInput('rol') || 'DevOps Engineer';

        info(`[CUSTOM ACTION] Starting processing for: ${username} (${role})`);

        // 2. Extract repository metadata from webhook/runner context with local fallback
        let owner = 'local-owner';
        let repo = 'local-repo';
        try {
            owner = context.repo.owner || owner;
            repo = context.repo.repo || repo;
        } catch {
            // Fallback when GITHUB_REPOSITORY is undefined during local execution
        }
        const ref = context.ref ?? 'refs/heads/main';
        const fullSha = context.sha ?? '0000000000000000000000000000000000000000';
        const sha = fullSha.substring(0, 7);
        const serverUrl = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
        const repoUrl = `${serverUrl}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
        const commitUrl = `${repoUrl}/commit/${encodeURIComponent(fullSha)}`;

        info(`[CUSTOM ACTION] Executing on repository: ${owner}/${repo} on branch ${ref} (commit ${sha})`);

        // 3. Generate outputs for downstream runner steps
        const timestamp = new Date().toISOString();
        const resultMessage = generateResultMessage({ username, role, owner, repo });

        setOutput('result', resultMessage);
        setOutput('resultado', resultMessage);
        setOutput('timestamp', timestamp);

        // 4. Render rich Markdown/HTML report in GitHub Actions Step Summary
        const outputsJson = JSON.stringify({ result: resultMessage, resultado: resultMessage, timestamp }, null, 4);

        await summary
            .addHeading('🚀 Custom TypeScript Action Report', 2)
            .addRaw(`\n\n> [!TIP]\n> **Result:** ${escapeHtml(resultMessage)}\n\n`)
            .addTable([
                [
                    { data: 'Metadata', header: true },
                    { data: 'Value', header: true }
                ],
                ['Status', '✅ <strong>Succeeded</strong>'],
                ['User', `<strong>${escapeHtml(username)}</strong>`],
                ['Role', `<code>${escapeHtml(role)}</code>`],
                ['Repository', `<a href="${repoUrl}">${escapeHtml(owner)}/${escapeHtml(repo)}</a>`],
                ['Branch / Ref', `<code>${escapeHtml(ref)}</code>`],
                ['Commit', `<a href="${commitUrl}"><code>${escapeHtml(sha)}</code></a>`],
                ['Node Runtime', `<code>${escapeHtml(process.version)}</code>`],
                ['Timestamp (UTC)', `<code>${escapeHtml(timestamp)}</code>`]
            ])
            .addDetails('📦 Raw Action Outputs (JSON)', `<pre><code>${escapeHtml(outputsJson)}</code></pre>`)
            .addSeparator()
            .addQuote(
                'Action bundled with esbuild (--target=node22) and executed on the GitHub Actions Node.js runtime.'
            )
            .write();

        info('[CUSTOM ACTION] Completed successfully.');
    } catch (error) {
        // 5. Handle runtime failures with native workflow annotations
        if (error instanceof Error) {
            setFailed(`Error during Custom Action execution: ${error.message}`);
        } else {
            setFailed('An unexpected untyped error occurred.');
        }
    }
}

run();
