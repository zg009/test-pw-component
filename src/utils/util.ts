export function ensureStrongPassword(password: string): boolean {
    let hasLength = password.length >= 12;
    const symbols = "!@#$%^&*()+-_";
    let hasOneSymbol = password.split("").filter(elem => symbols.includes(elem)).length > 0;
    const digits = "1234567890";
    let hasOneDigit = password.split("").filter(elem => digits.includes(elem)).length > 0;
    return hasLength && hasOneDigit && hasOneSymbol;
}