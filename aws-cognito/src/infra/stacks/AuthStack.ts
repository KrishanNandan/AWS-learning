import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';


export class AuthStack extends Stack {
    public userPool: UserPool;
    private identityPool: CfnIdentityPool;
    private userPoolClient: UserPoolClient;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createAdminsGroup();
        this.createIdentityPool();
    }
    private createUserPool() {
        this.userPool = new UserPool(this, 'SpaceUserPool', {
            selfSignUpEnabled: true,
            /**selfSignUpEnabled: true
            allows end users to sign themselves up (via Hosted UI or the Cognito API) instead of requiring an administrator to create accounts.
            you probably want to also configure verification (autoVerify) and account recovery policies if you enable self sign‑up */
            signInAliases: {
                username: true,
                email: true
            }
            /**signInAliases: { username: true, email: true }
            enables both username and email as valid sign-in identifiers. A user can authenticate using either their username or their email address.
            when email is enabled as an alias, the email attribute must be provided for users and is treated as an alias (Cognito will enforce uniqueness for that alias).
            you can also enable phone or preferredUsername here if needed. */
        });
        new CfnOutput(this, 'SpaceUserPoolId', {
            value: this.userPool.userPoolId
        });
    }
    private createUserPoolClient() {
        this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true,
            }
        });
        /**authFlows: the app client’s allowed authentication flows; these become the AuthFlow values you can pass to InitiateAuth/AdminInitiateAuth. */
        new CfnOutput(this, 'SpaceUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        });
    }
    private createAdminsGroup() {
        new CfnUserPoolGroup(this, 'SpaceAdmins', { userPoolId: this.userPool.userPoolId, groupName: 'admins' })
    }
    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        });
        new CfnOutput(this, 'SpaceIdentityPoolId', {
            value: this.identityPool.ref
        });
    }
}

/**command to activate user from confirmation status- Force change password to confirmed
 * aws cognito-idp admin-set-user-password --user-pool-id userPoolId --username UserName --password "password of user in quote" --permanent
*/