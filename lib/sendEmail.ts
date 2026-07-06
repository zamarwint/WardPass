import { Resend } from 'resend';

export const sendEmail = () => {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'zeacnt@proton.me',
        subject: 'Hello World',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
}