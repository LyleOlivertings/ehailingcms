import { sendEmail, processTemplate } from '../email';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';

// Mock nodemailer
jest.mock('nodemailer');

// Mock fs.promises
jest.mock('fs/promises');

describe('Email Service', () => {
  let mockSendMail;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock for sendMail
    mockSendMail = jest.fn();
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    // Mock environment variables
    process.env.EMAIL_HOST = 'smtp.example.com';
    process.env.EMAIL_PORT = '587';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASSWORD = 'password';
    process.env.EMAIL_FROM = '"Test Sender" <noreply@example.com>';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.EMAIL_HOST;
    delete process.env.EMAIL_PORT;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASSWORD;
    delete process.env.EMAIL_FROM;
  });

  describe('sendEmail', () => {
    it('should configure transporter and send email with correct options (port 587)', async () => {
      const mailData = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      };
      await sendEmail(mailData);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // As per current implementation for non-465 ports
        auth: {
          user: 'user@example.com',
          pass: 'password',
        },
      });
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Test Sender" <noreply@example.com>',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      });
    });

    it('should configure transporter with secure: true for port 465', async () => {
      process.env.EMAIL_PORT = '465';
      const mailData = {
        to: 'recipient@example.com',
        subject: 'Test Subject Secure',
        html: '<p>Test HTML Secure</p>',
      };
      await sendEmail(mailData);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 465,
        secure: true,
        auth: {
          user: 'user@example.com',
          pass: 'password',
        },
      });
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"Test Sender" <noreply@example.com>',
        to: 'recipient@example.com',
        subject: 'Test Subject Secure',
        html: '<p>Test HTML Secure</p>',
      });
    });

    it('should log an error if sending email fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSendMail.mockRejectedValueOnce(new Error('SMTP Error'));
      const mailData = {
        to: 'recipient@example.com',
        subject: 'Test Error',
        html: '<p>Test Error</p>',
      };

      await sendEmail(mailData);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('processTemplate', () => {
    it('should process a template with given data', async () => {
      fs.readFile.mockResolvedValue('Hello {{name}}! Your ride is {{status}}.');
      const templatePath = 'emails/test-template.html';
      const data = { name: 'Test User', status: 'Confirmed' };
      
      const result = await processTemplate(templatePath, data);
      
      expect(fs.readFile).toHaveBeenCalledWith(templatePath, 'utf-8');
      expect(result).toBe('Hello Test User! Your ride is Confirmed.');
    });

    it('should return template as is if no placeholders match data', async () => {
      fs.readFile.mockResolvedValue('Hello {{name}}!');
      const templatePath = 'emails/no-match-template.html';
      const data = { status: 'Pending' };

      const result = await processTemplate(templatePath, data);

      expect(result).toBe('Hello {{name}}!');
    });
    
    it('should return template as is if there are no placeholders', async () => {
      fs.readFile.mockResolvedValue('Hello World!');
      const templatePath = 'emails/no-placeholders-template.html';
      const data = { name: 'Test User' };

      const result = await processTemplate(templatePath, data);

      expect(result).toBe('Hello World!');
    });

    it('should ignore extra data not present in template placeholders', async () => {
      fs.readFile.mockResolvedValue('Hello {{name}}!');
      const templatePath = 'emails/extra-data-template.html';
      const data = { name: 'Test User', age: 30 };

      const result = await processTemplate(templatePath, data);

      expect(result).toBe('Hello Test User!');
    });

    it('should log an error and return null if reading template fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fs.readFile.mockRejectedValueOnce(new Error('File not found'));
      const templatePath = 'emails/non-existent-template.html';
      const data = { name: 'Test User' };

      const result = await processTemplate(templatePath, data);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error processing template:', expect.any(Error));
      expect(result).toBeNull();
      consoleErrorSpy.mockRestore();
    });
  });
});
