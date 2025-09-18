import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";


Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_RnArfbX1j',
            userPoolClientId: '44m4jbeahne3na5i8gmk71mv63'
        }
    }
});

export class AuthService {
    public async login(userName: string, password: string) {
        const SignInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH',
            }
        })
        return SignInOutput;
    }

    /** Call only after login*/
    public async getIdToken() {
        const authSession = await fetchAuthSession();
        return authSession.tokens?.idToken?.toString();
    }
}