import {  RegistrationManager, RegistrationManagerArgs } from "@solid/community-server";

export class StrongRegistrationManager extends RegistrationManager {
    
    public constructor(args: RegistrationManagerArgs) {
        super(args);
    }

    private validatePassword(password: string): boolean {
        let hasLength = password.length >= 12 ? true : false;
        const symbols = "!@#$%^&*()+-_";
        let hasOneSymbol = password.split("").filter(elem => symbols.includes(elem)).length > 0;
        const digits = "1234567890";
        let hasOneDigit = password.split("").filter(elem => digits.includes(elem)).length > 0;
        return hasLength && hasOneDigit && hasOneSymbol;
    }

}