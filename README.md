# Cape Rides CMS - E-Hailing Service Management


A modern CMS for managing an e-hailing service in Cape Town, built with Next.js, Tailwind CSS, and MongoDB. Designed to help drivers manage rides, customers, and generate quotes efficiently.

## Features

- 🚗 **Ride Management**
  - Create, view, and update ride details
  - Track payment status (paid/unpaid)
  - Generate instant quotes based on vehicle type, distance, and passengers
  - Copy ride details to clipboard for customer communication

- 👥 **Customer Management**
  - Maintain customer database
  - View ride history per customer
  - Add customer notes and contact information

- 📊 **Dashboard Analytics**
  - Total rides and revenue tracking
  - Unpaid rides monitoring
  - Recent activities overview

- 🛠️ **Additional Features**
  - Professional UI with Tailwind CSS
  - Mobile-responsive design
  - MongoDB database integration
  - Easy deployment with Vercel

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- NPM/Yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/LyleOlivertings/ehailingcms
cd ehailing-cms
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root of your project and add the following environment variables:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

For the application to function correctly, including database connectivity and email services, the following environment variables must be set in your environment (e.g., in a `.env.local` file for local development, or configured in your deployment environment):

- `MONGODB_URI`: Your MongoDB connection string. This is essential for database operations.

### Email Configuration

For email functionalities (like sending ride confirmations) to work, you also need to configure the following SMTP server details:

- `EMAIL_HOST`: Hostname of your SMTP server (e.g., `smtp.example.com`).
- `EMAIL_PORT`: Port of your SMTP server (e.g., `587` for TLS or `465` for SSL).
- `EMAIL_USER`: Username for SMTP authentication.
- `EMAIL_PASSWORD`: Password for SMTP authentication.
- `EMAIL_FROM`: The sender email address that will appear in the 'From' field (e.g., `"Your App Name" <noreply@example.com>`).

Ensure these variables are correctly set up before running the application or deploying it.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.