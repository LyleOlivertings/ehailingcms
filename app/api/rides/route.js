import { NextResponse } from 'next/server';
import Ride from '@/models/Ride';
import Customer from '@/models/Customer';
import dbConnect from '@/lib/db';
import { vehicleTypes } from '@/lib/pricing'; // Add this import
import { sendEmail, processTemplate } from '@/lib/email';

export async function POST(request) {
  await dbConnect();
  const data = await request.json();

  // Find or create customer
  let customer = await Customer.findOne({ phone: data.customerPhone });
  if (!customer) {
    customer = await Customer.create({
      name: data.customerName,
      phone: data.customerPhone
    });
  }

  // Calculate quote
  const vehicle = vehicleTypes.find(v => v.name === data.vehicleType);
  const quote = vehicle.baseRate + (data.distance * vehicle.perKmRate);

  // Create ride
  const ride = await Ride.create({
    customer: customer._id,
    vehicleType: data.vehicleType,
    passengers: data.passengers,
    distance: data.distance,
    quoteAmount: quote,
    pickupLocation: data.pickupLocation,
    dropoffLocation: data.dropoffLocation
  });

  if (customer.email) {
    const templateData = {
      customerName: customer.name,
      pickupLocation: ride.pickupLocation,
      dropoffLocation: ride.dropoffLocation,
      vehicleType: ride.vehicleType,
      passengers: ride.passengers,
      totalFare: ride.quoteAmount.toFixed(2),
      status: "Confirmed",
    };

    try {
      const htmlBody = await processTemplate('emails/ride-confirmation.html', templateData);
      await sendEmail({
        to: customer.email,
        subject: 'Your Cape Rides Confirmation',
        html: htmlBody,
      });
      console.log('Confirmation email sent to:', customer.email);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  }

  return NextResponse.json(ride);
}

export async function GET() {
  await dbConnect();
  const rides = await Ride.find().populate('customer');
  return NextResponse.json(rides);
}