import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();
const tableStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", { spacesTable: tableStack.spacesTable });
new ApiStack(app, "ApiStack", { lambdaFunction: lambdaStack.lambdaIntegration });