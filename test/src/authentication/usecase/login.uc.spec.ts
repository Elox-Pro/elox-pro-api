import { LoginUC } from "../../../../src/authentication/usecases/login.uc";

describe('LoginUC', () => {

    it('should be defined', () => {
        expect(new LoginUC(null, null)).toBeDefined();
    });
});