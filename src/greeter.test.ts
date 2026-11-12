import { describe, expect, it } from 'vitest';

import { generateResultMessage } from './greeter.js';

describe('Greeter Domain Logic', () => {
    it('correctly generates the formatted result message with the provided parameters', () => {
        const result = generateResultMessage({
            username: 'Gustavo',
            role: 'Lead Cloud Architect',
            owner: 'acme-corp',
            repo: 'infrastructure'
        });

        expect(result).toBe('Processing completed for Gustavo (Lead Cloud Architect) in acme-corp/infrastructure');
    });

    it('correctly supports default or alternative values', () => {
        const result = generateResultMessage({
            username: 'DevOpsBot',
            role: 'Automation Runner',
            owner: 'organization',
            repo: 'pipeline'
        });

        expect(result).toContain('DevOpsBot (Automation Runner)');
        expect(result).toContain('organization/pipeline');
    });
});
