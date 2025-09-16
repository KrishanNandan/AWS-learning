import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";

const awsRegion = 'ap-south-1';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'userPoolId',
            userPoolClientId: 'userPoolClientId'
        }
    }
});

export class AuthService {
    public async login(userName: string, password: string) {
        const SignInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
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