import { TfaType } from "@prisma/client";

// By default the tfa type is email
export function getDefaultTfaType(type: TfaType): TfaType {
    return type === TfaType.NONE ? TfaType.EMAIL : type;
}