import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = 'ap-south-1';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_RnArfbX1j',
            userPoolClientId: '44m4jbeahne3na5i8gmk71mv63',
            identityPoolId: 'ap-south-1:14e61871-e334-44b1-b48d-561794f228cd'
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

    public async generateTemporaryCredentials() {
        const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-south-1_RnArfbX1j`
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'ap-south-1:14e61871-e334-44b1-b48d-561794f228cd',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        console.log(credentials);
        return credentials;
    }
}