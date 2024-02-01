import { GenerateTokens } from '../../../../src/authentication/helpers/generate-tokens.helper';

describe('GenerateTokensUc', () => {
  it('should be defined', () => {
    expect(new GenerateTokens()).toBeDefined();
  });
});
