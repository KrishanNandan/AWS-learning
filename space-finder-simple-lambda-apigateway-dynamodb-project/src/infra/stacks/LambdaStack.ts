import { Stack, type StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {
    public readonly lambdaIntegration: LambdaIntegration;
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id);
        const helloLambda = new LambdaFunction(this, 'HelloHandler', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'hello.main',
            code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
            environment: {TABLE_NAME: props.spacesTable.tableName}
        });
        this.lambdaIntegration = new LambdaIntegration(helloLambda);
    }
}