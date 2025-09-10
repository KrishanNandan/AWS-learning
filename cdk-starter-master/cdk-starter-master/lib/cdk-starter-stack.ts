import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create an S3 Bucket with 3 types of construct
  const bucket =  new Bucket(this, 'MyFirstBucket', {
      lifecycleRules: [{ expiration: cdk.Duration.days(3) }]
    });

  new cdk.CfnOutput(this, 'MyFirstBucketName', { value: bucket.bucketName });

  }
}
