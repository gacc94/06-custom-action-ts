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

const HTML_ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

/**
 * Escapes HTML special characters to safely render dynamic values in Step Summary tables.
 * @param value Raw string input
 * @returns HTML-escaped string
 */
export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}
