import { type APIGatewayProxyEvent, type APIGatewayProxyResult, type Context } from "aws-lambda";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { hasAdminGroup } from "../../utils/utilMethods";
import { captureAWSv3Client, getSegment } from "aws-xray-sdk-core";

const s3Client = captureAWSv3Client(new S3Client({}))

async function handler(event: APIGatewayProxyEvent, context: Context) {

    /**Adding segment to see time of execution in the x-ray */
    const subSeg = getSegment().addNewSubsegment('MyLongCall');
    await new Promise((resolve) => { setTimeout(resolve, 3000); });
    subSeg.close();
    const subSeg1 = getSegment().addNewSubsegment('MyShortCall');
    await new Promise((resolve) => { setTimeout(resolve, 500); });
    subSeg1.close();

    const listBucketCmd = new ListBucketsCommand({});
    const listBucketResult = (await s3Client.send(listBucketCmd)).Buckets;
    const isAdminGroup = hasAdminGroup(event);
    console.log("Has admin group", isAdminGroup);
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify("Hello from lambda, this is your buckets" + JSON.stringify(listBucketResult))
    }

    return response;
}

export { handler };