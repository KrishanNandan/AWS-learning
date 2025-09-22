import { APIGatewayProxyEvent } from "aws-lambda";

export function hasAdminGroup(event: APIGatewayProxyEvent) {
    return (event.requestContext?.authorizer?.claims['cognito:groups'] as String)?.includes('admins');
}