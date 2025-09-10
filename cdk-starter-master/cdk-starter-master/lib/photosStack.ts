import { Fn, Stack, type StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class PhotosStack extends Stack {
    private stackSuffix: string;
    public bucketArn: string;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.intializeStackSuffix();
        const bucket = new Bucket(this, "PhotoBucket", {
            bucketName: `photos-bucket-${this.stackSuffix}`,
        });
        this.bucketArn = bucket.bucketArn;
    }
    private intializeStackSuffix() {
        const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
        this.stackSuffix = Fn.select(4, Fn.split("-", shortStackId));
    }
}