import { AccountStore, CredentialsHandler, InteractionHandler, readJsonStream, Representation, InteractionHandlerInput, MethodNotAllowedHttpError } from "@solid/community-server";
import assert from "assert";

export class StrongEmailPasswordAuthorizer extends InteractionHandler {
    private readonly accountStore: AccountStore;
    private readonly source: CredentialsHandler;
    
    public constructor(accountStore: AccountStore, source: CredentialsHandler) {
        super();
        this.accountStore = accountStore;
        this.source = source;
    }

    private validatePassword(password: string): boolean {
        let hasLength = password.length >= 12 ? true : false;
        const symbols = "!@#$%^&*()+-_";
        let hasOneSymbol = password.split("").filter(elem => symbols.includes(elem)).length > 0;
        const digits = "1234567890";
        let hasOneDigit = password.split("").filter(elem => digits.includes(elem)).length > 0;
        return hasLength && hasOneDigit && hasOneSymbol;
    }

    private validateEmail(email: string): boolean {
        const emailRegex = new RegExp(".{2,}@.{2,}\..{2,}");
        return emailRegex.test(email);
    }

    public async handle({ operation }: InteractionHandlerInput): Promise<Representation> {
        if (operation.method !== 'POST') {
            throw new MethodNotAllowedHttpError([operation.method], "Only POST requests are allowed.");
        }
        const json = await readJsonStream(operation.body.data);
        const { email, password } = json;
        assert(typeof email === 'string' && this.validateEmail(email), 'Email does not satisfy requirements: something@whatever.end');
        assert(typeof password === 'string' && this.validatePassword(password), 'Password does not satisfy requirements: 12 or more characters, with at least 1 digit and 1 symbol')
        
        const webId = await this.accountStore.authenticate(email, password);
        delete json.password;
        return this.source.handleSafe({ operation, body: { ...json, email, webId }});
    }

}