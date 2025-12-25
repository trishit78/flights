import { Job, Worker } from "bullmq";


import { getRedisConnObject } from "../config/redis.config";
import { NotificationDTO } from "../DTO/notification.DTO";



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