import { Stack, type StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {
    public readonly lambdaIntegration: LambdaIntegration;
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id);
        const helloLambda = new NodejsFunction(this, 'HelloHandler', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'hello.ts'),
            environment: { TABLE_NAME: props.spacesTable.tableName }
        });
        helloLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets', 's3:Bucket'],//allow iam policy for these command
            resources: ['*']// allows for all the s3 of this cloudformation, for specific we can put like 'arn:aws:s3:::my-bucket-name'
        }))
        this.lambdaIntegration = new LambdaIntegration(helloLambda);
    }
}