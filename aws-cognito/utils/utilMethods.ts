import { APIGatewayProxyEvent } from "aws-lambda";

export function hasAdminGroup(event: APIGatewayProxyEvent) {
    const groups = event.requestContext?.authorizer?.claims['cognito:groups']
    return (groups as String)?.includes('admins');
}