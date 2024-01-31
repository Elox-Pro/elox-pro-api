import { BCryptStategy } from '../../../../../src/authentication/strategies/hashing/bcrypt.strategy';

describe('BcryptService', () => {
  it('should be defined', () => {
    expect(new BCryptStategy()).toBeDefined();
  });

  it('should hash', async () => {
    const service = new BCryptStategy();
    const hashed = await service.hash('test');
    expect(hashed).toBeDefined();
  });

  it('should compare', async () => {
    const service = new BCryptStategy();
    const hashed = await service.hash('test');
    expect(await service.compare('test', hashed)).toBeTruthy();
  });

});
