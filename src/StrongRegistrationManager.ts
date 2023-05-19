import {  RegistrationManager, RegistrationManagerArgs, RegistrationParams, assertPassword, hasScheme } from "@solid/community-server";
import assert from "assert";

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/u;

export class StrongRegistrationManager extends RegistrationManager {
    
    public constructor(args: RegistrationManagerArgs) {
        super(args);
    }

    private parseString(input: unknown): string | undefined {
        return typeof input === "string" ? input.trim() : undefined;
    }

    private ensureStrongPassword(password: string): boolean {
      let hasLength = password.length >= 12;
      const symbols = "!@#$%^&*()+-_";
      let hasOneSymbol = password.split("").filter(elem => symbols.includes(elem)).length > 0;
      const digits = "1234567890";
      let hasOneDigit = password.split("").filter(elem => digits.includes(elem)).length > 0;
      return hasLength && hasOneDigit && hasOneSymbol;
    }

    public validateInput(input: NodeJS.Dict<unknown>, allowRootPod: boolean): RegistrationParams {
        const {
            email, password, confirmPassword, webId, podName, register, createPod, createWebId, template, rootPod,
          } = input;
      
          // Parse email
          const trimmedEmail = this.parseString(email);
          assert(trimmedEmail && emailRegex.test(trimmedEmail), 'Please enter a valid e-mail address.');
          
          assertPassword(password, confirmPassword);
      
          assert(this.ensureStrongPassword(password), 'Password is too weak: Must have 12+ characters, 1 digit, 1 symbol.');

          const validated: RegistrationParams = {
            email: trimmedEmail,
            password,
            register: Boolean(register) || Boolean(createWebId),
            createPod: Boolean(createPod) || Boolean(createWebId),
            createWebId: Boolean(createWebId),
            rootPod: Boolean(rootPod),
          };
          assert(validated.register || validated.createPod, 'Please register for a WebID or create a Pod.');
          assert(allowRootPod || !validated.rootPod, 'Creating a root pod is not supported.');
      
          // Parse WebID
          if (!validated.createWebId) {
            const trimmedWebId = this.parseString(webId);
            assert(trimmedWebId && hasScheme(trimmedWebId, 'http', 'https'), 'Please enter a valid WebID.');
            validated.webId = trimmedWebId;
          }
      
          // Parse Pod name
          if (validated.createPod && !validated.rootPod) {
            const trimmedPodName = this.parseString(podName);
            assert(trimmedPodName && trimmedPodName.length > 0, 'Please specify a Pod name.');
            validated.podName = trimmedPodName;
          }
      
          // Parse template if there is one
          if (template) {
            validated.template = this.parseString(template);
          }
      
          return validated;
    }

}