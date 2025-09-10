import { IAspect } from "aws-cdk-lib";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";

export class BucketTagger implements IAspect {
    private tagKey: string;
    private tagValue: string;

    constructor(tagKey: string, tagValue: string) {
        this.tagKey = tagKey;
        this.tagValue = tagValue;
    }

    visit(node: IConstruct): void {
        console.log(`Visiting node: ${node.node.id}`);
        if (node instanceof CfnBucket) {
            node.tags.setTag(this.tagKey, this.tagValue);
        }
    }

}