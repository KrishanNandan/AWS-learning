import { Stack, type StackProps } from "aws-cdk-lib";
import { Code, Function as LambdaFunc, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface PhotosStackHandlerProps extends StackProps {
    bucketArn: string;
}

export class PhotosStackHandler extends Stack {
    constructor(scope: Construct, id: string, props: PhotosStackHandlerProps) {
        super(scope, id, props);
        new LambdaFunc(this, 'MyFunction', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'index.handler',
            code: Code.fromInline(`exports.handler = async function(event, context) {
                console.log("BUCKET_ARN: ", process.env.BUCKET_ARN);
            }`),
            environment: {
                BUCKET_ARN: props.bucketArn
            }
        });
    }
}