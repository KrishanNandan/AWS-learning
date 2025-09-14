import { type APIGatewayProxyEvent, type APIGatewayProxyResult, type Context } from "aws-lambda";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({})

async function handler(event: APIGatewayProxyEvent, context: Context) {
    const listBucketCmd = new ListBucketsCommand({});
    const listBucketResult = (await s3Client.send(listBucketCmd)).Buckets;

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify("Hello from lambda, this is your buckets" + JSON.stringify(listBucketResult))
    }
    
    return response;
}

export { handler };