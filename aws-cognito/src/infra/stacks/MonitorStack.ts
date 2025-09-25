import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, Metric } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from "path";

export class MonitorStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const spacesApi4xxAlarm = new Alarm(this, 'spacesApi4xxAlarm', {
            metric: new Metric({
                metricName: "4XXError",
                namespace: "AWS/ApiGateway",
                statistic: "Sum",
                /**Period is the duration for which cloudwatch will aggregate the metric, 
                 * Meaning cloudwatch will see how many times 4xx error occured in 1 minute and if it occurs 
                 * more than 5 and since evaluation period is also 1 so InAlarm state will be triggered*/
                period: Duration.minutes(1),
                /**ApiName is name of one of the metric and we have 2 apis in apiGateway and one of them
                 * is 'Space Finder Service' so cloudwatch will attach the alarm to this api
                */
                dimensionsMap: {
                    'ApiName': 'Space Finder Service'
                }
            }),
            /**evaluationPeriods means even if 1 time threshold is acheived it will go in alarm state*/
            evaluationPeriods: 1,
            threshold: 5,
            alarmName: 'spacesApi4xxAlarm'
        });

        /**Lambda which will run if threshold acheived, here its ok state so if any instances occurs this lambda will trigger*/
        const webHookLambda = new NodejsFunction(this, 'webHookLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..', '..', 'services', 'monitor', 'handler.ts'))
        });

        /**Below is the sns topic*/
        const alarmTopic = new Topic(this, 'AlarmTopic', {
            displayName: 'AlarmTopic',
            topicName: 'AlarmTopic'
        });

        /**Here we have attached the lambda to the SNS topic */
        alarmTopic.addSubscription(new LambdaSubscription(webHookLambda));
        /**Here we are creating SnsAction which will be attached to the alaram */
        const topicAction = new SnsAction(alarmTopic);
        /**Attaching action topic to alaram and also setting action to happen for okay state*/
        spacesApi4xxAlarm.addAlarmAction(topicAction);
        spacesApi4xxAlarm.addOkAction(topicAction)
    }
}