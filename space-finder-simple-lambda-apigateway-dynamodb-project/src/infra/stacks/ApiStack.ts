import { Stack, type StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { type LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

interface ApiStackProps extends StackProps {
    lambdaFunction: LambdaIntegration; // Replace 'any' with the actual type of your Lambda function if available
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id);
        const api = new RestApi(this, 'SpaceFinderApi', {
            restApiName: 'Space Finder Service',
            description: 'This service serves space finder.'
        });
        const spacesResource = api.root.addResource('spaces');
        spacesResource.addMethod('GET', props?.lambdaFunction);
    }
}