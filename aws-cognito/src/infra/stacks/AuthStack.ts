import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


export class AuthStack extends Stack {
    public userPool: UserPool;
    private identityPool: CfnIdentityPool;
    private userPoolClient: UserPoolClient;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    private adminRole: Role;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createIdentityPool();
        this.createRoles();
        this.attachRoles();
        this.createAdminsGroup();
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
        new CfnUserPoolGroup(this, 'SpaceAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins',
            roleArn: this.adminRole.roleArn
        })
    }
    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        });

    }
    /**In this method we are only creating IAM roles not attaching it to identity pool best example will be of Admin role which have been created here but
     * it is attached to user pool group, also it is an example of how to attach policy to a role
    */
    private createRoles() {
        /**For authenticated role */
        this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                    },
                    'ForAnyValue:StringLike': {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        /**For unauthenticated role */
        this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated"
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        })

        /**For admin role */
        this.adminRole = new Role(this, 'CognitoDefaultAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    "cognito-identity.amazonaws.com:amr": "authenticated"
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.adminRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets'],
            resources: ['*']
        }));
    }
    private attachRoles() {
        new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }
}

/**command to activate user from confirmation status- Force change password to confirmed
 * aws cognito-idp admin-set-user-password --user-pool-id userPoolId --username UserName --password "password of user in quote" --permanent
*/