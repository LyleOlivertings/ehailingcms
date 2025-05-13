import nodemailer from 'nodemailer';
import hbs from 'handlebars';
import fs from 'fs';
import path from 'path';

const compileTemplate = (templateName, context) => {
  const filePath = path.join(process.cwd(), 'emails', `${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf-8');
  return hbs.compile(source)(context);
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendRideConfirmation = async (emailData) => {
  try {
    const html = compileTemplate('ride-confirmation', {
      customerName: emailData.customerName,
      pickupLocation: emailData.pickupLocation,
      dropoffLocation: emailData.dropoffLocation,
      vehicleType: emailData.vehicleType,
      passengers: emailData.passengers,
      totalFare: emailData.totalFare.toFixed(2),
      status: emailData.status,
    });

    await transporter.sendMail({
      from: `"Cape Rides" <${process.env.EMAIL_USER}>`,
      to: emailData.customerEmail,
      subject: 'Your Ride Confirmation - Cape Rides',
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};