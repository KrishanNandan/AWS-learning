import { Duration, Stack, type StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Role, ServicePrincipal, ManagedPolicy, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';


interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {
    public readonly lambdaIntegration: LambdaIntegration;
    // private helloLambdaRole: Role;
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id);
        // this.createAttachRole();
        const helloLambda = new NodejsFunction(this, 'HelloHandler', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'hello.ts'),
            environment: { TABLE_NAME: props.spacesTable.tableName },
            tracing:Tracing.ACTIVE, /**To allow x-ray we are making this option as active*/
            timeout:Duration.minutes(1) /** default time for lambda is 3 seconds*/
            // role: this.helloLambdaRole
        });
        helloLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets', 's3:Bucket'],//allow iam policy for these command
            resources: ['*']// allows for all the s3 of this cloudformation, for specific we can put like 'arn:aws:s3:::my-bucket-name'
        }))
        this.lambdaIntegration = new LambdaIntegration(helloLambda);
    }
    // private createAttachRole() {
    //     this.helloLambdaRole = new Role(this, 'HelloHandlerRole', {
    //         assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    //         managedPolicies: [
    //             ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole') // CloudWatch Logs
    //         ],
    //     });
    //     // Add function-specific permissions (tighten resources where possible)
    //     this.helloLambdaRole.addToPolicy(new PolicyStatement({
    //         effect: Effect.ALLOW,
    //         actions: ["s3:*","s3-object-lambda:*"], // will allow everything
    //         resources: ['*'],
    //     }));
    // }
}