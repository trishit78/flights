import { serverConfig } from "../config";
import { InternalServerError } from "../utils/errors/app.error";
import transporter from "../config/nodemailer.config";


export async function sendEmail(to:string,subject:string,body:string) {
    try {
        await transporter.sendMail({
            from:serverConfig.MAIL_USER,
            to,
            subject,
            html:body
        });
    } catch (error) {
        throw new InternalServerError('failed to send email')
    }
}