import type { UserConfig } from '@commitlint/types';

/**
 * Canonical mapping of Conventional Commit types to their required leading subject emoji.
 */
const TYPE_EMOJI_MAP: Record<string, string> = {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    style: '💄',
    refactor: '♻️',
    perf: '⚡',
    test: '🧪',
    build: '📦',
    ci: '👷',
    chore: '🔧',
    revert: '⏪'
};

/**
 * Strips Unicode variation selectors (U+FE0F) so visually identical emojis
 * such as "⚡" and "⚡️" or "♻" and "♻️" compare uniformly.
 */
function normalizeEmoji(value: string): string {
    return value.replace(/\uFE0F/g, '');
}

/**
 * Scopes emitted by Dependabot (`deps` and `deps-dev`) when configured with `include: 'scope'`.
 */
const DEPENDABOT_SCOPES = new Set(['deps', 'deps-dev']);

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', Object.keys(TYPE_EMOJI_MAP)],
        'subject-emoji-by-type': [2, 'always']
    },
    plugins: [
        {
            rules: {
                'subject-emoji-by-type': ({ type, scope, subject }) => {
                    if (!type || !subject) {
                        return [false, 'Commit message must follow "<type>(scope?): <emoji> <description>"'];
                    }

                    // Dependabot cannot insert an emoji after "<type>(<scope>): "
                    if (
                        (type === 'build' || type === 'chore') &&
                        scope &&
                        DEPENDABOT_SCOPES.has(scope) &&
                        subject.startsWith('bump ')
                    ) {
                        return [true];
                    }

                    const expectedEmoji = TYPE_EMOJI_MAP[type];
                    if (!expectedEmoji) {
                        // Unknown commit types are handled by the built-in type-enum rule
                        return [true];
                    }

                    const normalizedSubject = normalizeEmoji(subject);
                    const normalizedExpected = normalizeEmoji(expectedEmoji);

                    if (!normalizedSubject.startsWith(`${normalizedExpected} `)) {
                        return [
                            false,
                            `Commit of type "${type}" must start its subject with "${expectedEmoji} " (e.g. "${type}: ${expectedEmoji} add feature")`
                        ];
                    }

                    const descriptionAfterEmoji = normalizedSubject.slice(normalizedExpected.length).trim();
                    if (!descriptionAfterEmoji) {
                        return [false, `Commit subject must include a description after "${expectedEmoji}"`];
                    }

                    return [true];
                }
            }
        }
    ]
};

export default config;
