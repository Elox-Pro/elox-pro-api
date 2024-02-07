import { SetMetadata } from "@nestjs/common";
import { AuthenticationType } from "../enums/authentication-type.enum";

export const AUTHENTICATION_TYPE_KEY = 'AUTHENTICATION_TYPE_KEY';

export const Authentication = (...authenticationTypes: AuthenticationType[]) => {
    return SetMetadata(AUTHENTICATION_TYPE_KEY, authenticationTypes);
}