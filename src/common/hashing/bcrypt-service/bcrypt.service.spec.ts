import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  it('should be defined', () => {
    expect(new BcryptService()).toBeDefined();
  });

  it('should hash', async () => {
    const service = new BcryptService();
    const hashed = await service.hash('test');
    expect(hashed).toBeDefined();
  });

  it('should compare', async () => {
    const service = new BcryptService();
    const hashed = await service.hash('test');
    expect(await service.compare('test', hashed)).toBeTruthy();
  });

});
