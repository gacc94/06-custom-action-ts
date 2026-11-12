import { getInput, info, setFailed, setOutput, summary } from '@actions/core';
import { context } from '@actions/github';

import { generateResultMessage } from './greeter.js';

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
        const sha = (context.sha ?? '0000000000000000000000000000000000000000').substring(0, 7);

        info(`[CUSTOM ACTION] Executing on repository: ${owner}/${repo} on branch ${ref} (commit ${sha})`);

        // 3. Generate outputs for downstream runner steps
        const timestamp = new Date().toISOString();
        const resultMessage = generateResultMessage({ username, role, owner, repo });

        setOutput('result', resultMessage);
        setOutput('resultado', resultMessage);
        setOutput('timestamp', timestamp);

        // 4. Render Markdown report in GitHub Actions Step Summary
        await summary
            .addHeading('🚀 Custom TypeScript Action Report')
            .addTable([
                [
                    { data: 'Field', header: true },
                    { data: 'Value', header: true }
                ],
                ['User', username],
                ['Role', role],
                ['Repository', `${owner}/${repo}`],
                ['Commit', sha],
                ['Timestamp', timestamp]
            ])
            .addQuote('Action bundled with esbuild and executed directly on the Node.js runtime.')
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
