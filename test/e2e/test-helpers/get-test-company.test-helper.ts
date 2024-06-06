import { Company } from "@prisma/client";

export function getTestCompany(): Company {
    return {
        name: "Apple Inc.",
    } as Company;
}

export function getTestCompany2(): Company {
    return {
        name: "Saudi Aramco",
    } as Company;
}