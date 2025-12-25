import { Job, Worker } from "bullmq";


import { getRedisConnObject } from "../config/redis.config";
import { NotificationDTO } from "../DTO/notification.DTO";
import { renderMailTemplate } from "../template/template.handler";
import logger from "../config/logger.config";
import { sendEmail } from "../service/mailer.service";



export const MAILER_PAYLOAD = 'payload-mail';
export const MAILER_QUEUE = "queue-mailer"


export const setupMailerWorker = () => {

    const emailProcessor = new Worker<NotificationDTO>(
        MAILER_QUEUE, // Name of the queue
        async (job: Job) => {

            if(job.name !== MAILER_PAYLOAD) {
                throw new Error("Invalid job name");
            }

            // call the service layer from here.
            const payload = job.data;
            console.log(`Processing email for: ${JSON.stringify(payload)}`);

            const emailContent =  await renderMailTemplate(payload.templateId,payload.params);
await sendEmail(payload.to, payload.subject,emailContent );
            
             logger.info(`Email sent to ${payload.to} with subject  ${payload.subject}`);


        }, // Process function
        {
            connection: getRedisConnObject()
        }
    )

    emailProcessor.on("failed", () => {
        console.error("Email processing failed");
    });

    emailProcessor.on("completed", () => {
        console.log("Email processing completed successfully");
    });
}