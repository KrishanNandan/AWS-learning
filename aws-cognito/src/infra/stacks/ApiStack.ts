import { Stack, type StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, CognitoUserPoolsAuthorizer, type LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

interface ApiStackProps extends StackProps {
    lambdaFunction: LambdaIntegration; // Replace 'any' with the actual type of your Lambda function if available
    userPool: IUserPool;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id);

        const api = new RestApi(this, 'SpaceFinderApi', {
            restApiName: 'Space Finder Service',
            description: 'This service serves space finder.'
        });

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'spacesApiAuthorizer', {
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization' /** Here we are telling to pass the token in header */
        });

        authorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }

        const spacesResource = api.root.addResource('spaces');
        spacesResource.addMethod('GET', props?.lambdaFunction, optionsWithAuth);// if we want a post request as well then we can have another line with but inplace of get it will be post and in that case 2 path will be pointing to same lambda
    }/**If optionsWithAuth not passes then Authorization will be none i.e API will be public
        we can do that manually as well by going to api gateway and then to resources and then selecting a method
        and going to method request settings
      */
}