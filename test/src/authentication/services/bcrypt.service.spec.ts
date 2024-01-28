import { BCryptService } from '../../../../src/authentication/services/bcrypt.service';

describe('BcryptService', () => {
  it('should be defined', () => {
    expect(new BCryptService()).toBeDefined();
  });

  it('should hash', async () => {
    const service = new BCryptService();
    const hashed = await service.hash('test');
    expect(hashed).toBeDefined();
  });

  it('should compare', async () => {
    const service = new BCryptService();
    const hashed = await service.hash('test');
    expect(await service.compare('test', hashed)).toBeTruthy();
  });

});
