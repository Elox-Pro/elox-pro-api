import { LoginUC } from "authentication/usecases/login.uc";

describe('LoginUC', () => {

    it('should be defined', () => {
        expect(new LoginUC(null, null, null, null)).toBeDefined();
    });
});