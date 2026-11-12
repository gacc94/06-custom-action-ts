export interface GreeterOptions {
    username: string;
    role: string;
    owner: string;
    repo: string;
}

/**
 * Generates the consolidated result message for the Custom Action.
 * @param options User, role, and repository context parameters
 * @returns Formatted execution summary string
 */
export function generateResultMessage(options: GreeterOptions): string {
    return `Processing completed for ${options.username} (${options.role}) in ${options.owner}/${options.repo}`;
}
