### AWS LAMBDA CODE CHALLENGES
# Dependency Management
# TypeScript Compilation and bundling


## Dependency Management
Runable application can be broken down into app code and Dependencies(Node_Module) and dependency can be further broken down into AWS SDK and thirdPartyLib, we will have to make sure that we don't deploy dev dependencies like tsnode etc and also aws sdk since by default aws sdk already there in aws.

## TypeScript Compilation and bundling
We have to make sure that we do proper tree shaking and convert ts code to js code

## Solution
NodeJsFunction CDK construct (uses esbuild library under the hood)(aws-lambda-nodejs)

awsCdk(cloud devlopment kit)- to create resources and infrastructure, inpast it was monolith(all in one), now with v3 every resource have their own package
awsSdk(software devlopment kit)- To access other aws resources from our account, earlier each resource were in different packages now all in one i.e. following monolith architecture.