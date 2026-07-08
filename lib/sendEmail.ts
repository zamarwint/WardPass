import { Resend } from 'resend';

export const sendEmail = async ({ to, subject, text }: { to: string, subject: string, text: string }) => {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: text
    }).catch((e) => {
        console.log(e, false);
        return e;
    }).then(() => {
        return true;
    });
}