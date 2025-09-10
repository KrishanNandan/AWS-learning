import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({})

async function handler(event: APIGatewayProxyEvent, context: Context) {
    const listBucketCmd = new ListBucketsCommand({});
    const listBucketResult = (await s3Client.send(listBucketCmd)).Buckets;

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify("Hello from lambda, this is your buckets" + JSON.stringify(listBucketResult))
    }

    console.log("Event: ", event);
    return response;
}

export { handler };