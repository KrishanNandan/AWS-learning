import { App } from 'aws-cdk-lib';
import { EventBridgeStack } from '../src/infra/EventBridgeStack';

const app = new App();

new EventBridgeStack(app, 'EventBridge');
