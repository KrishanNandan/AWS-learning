import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
    const service = new AuthService();
    await service.login("user", "password");
    await service.getIdToken();
    const credentials = await service.generateTemporaryCredentials();
    const buckets = await listBuckets(credentials);
    console.log("krishan", buckets);
    const a = 5;
}

async function listBuckets(credentials: any) {
    const client = new S3Client({
        credentials: credentials
    });
    const command = new ListBucketsCommand({});
    const result = await client.send(command);
    return result;
}

testAuth();

console.log("done");