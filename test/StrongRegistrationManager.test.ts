import { AccountStore, IdentifierGenerator, OwnershipValidator, PodManager, PodSettings, ResourceIdentifier } from "@solid/community-server";
import { ensureStrongPassword } from './../src/utils/util';
import { StrongRegistrationManager } from './../src/StrongRegistrationManager';


describe('A StrongRegistrationManager', (): void => {
    const webId = 'http://alice.test.com/card#me';
    const email = 'alice@test.email';
    // const password = 'superSecretPassword';
    // const confirmPassword = password;
    const podName = 'alice';
    const podBaseUrl = 'http://test.com/alice/';
    const createWebId = true;
    const register = true;
    const createPod = true;
    const rootPod = true;

    const baseUrl = 'http://test.com/';
    const webIdSuffix = '/profile/card';
    let podSettings: PodSettings;
    let identifierGenerator: IdentifierGenerator;
    let ownershipValidator: OwnershipValidator;
    let accountStore: AccountStore;
    let podManager: PodManager;
    let manager: StrongRegistrationManager;

    beforeEach(async(): Promise<void> => {
        podSettings = { email, webId, podBaseUrl };
    
        identifierGenerator = {
          generate: jest.fn((name: string): ResourceIdentifier => ({ path: `${baseUrl}${name}/` })),
          extractPod: jest.fn(),
        };
    
        ownershipValidator = {
          handleSafe: jest.fn(),
        } as any;
    
        accountStore = {
          create: jest.fn(),
          verify: jest.fn(),
          deleteAccount: jest.fn(),
        } as any;
    
        podManager = {
          createPod: jest.fn(),
        };
    
        manager = new StrongRegistrationManager({
          baseUrl,
          webIdSuffix,
          identifierGenerator,
          accountStore,
          ownershipValidator,
          podManager,
        });
      });

    describe('test for jest', (): void => {
        test('checks jest is working', (): void => {
            let s = "Hello";
            expect(s).toBe("Hello");
        })
    })

    describe('tests password validation fn', (): void => {
        test('checks password that is too short', (): void => {
            const shortPassword = "imtooshort"
            expect(ensureStrongPassword(shortPassword)).toBe(false);
        })
    })

    describe('validates input', (): void => {
        test('checks password that is too short', (): void => {
            let password = 'short';
            let confirmPassword = password;
            let input: any = { email, webId, password, confirmPassword, register, createPod, podName };
            expect((): any => manager.validateInput(input, false)).toThrow('Password is too weak: Must have 12+ characters, 1 digit, 1 symbol.');
        })
    })

});