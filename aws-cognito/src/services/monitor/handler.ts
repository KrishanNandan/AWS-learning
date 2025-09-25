import { SNSEvent, Context } from "aws-lambda";


export const handler = async (event: SNSEvent, context?: Context) => {
    for (const record of event.Records) {
        await fetch("webhookUrl", {
            method: 'POST',
            body: JSON.stringify({
                'text': `Aws Message: ${record.Sns.Message}`
            })
        })
    }
}