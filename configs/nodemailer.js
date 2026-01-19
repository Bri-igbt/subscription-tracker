import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = 'blakechima@gmail.com';

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
})