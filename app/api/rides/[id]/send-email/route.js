import { NextResponse } from 'next/server';
import { sendRideConfirmation } from '@/lib/email';
import Ride from '@/models/Ride';
import Customer from '@/models/Customer';
import dbConnect from '@/lib/db';

export async function POST(request, { params }) {
  await dbConnect();
  try {
    const ride = await Ride.findById(params.id).populate('customer');
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    if (!ride.customer?.email) {
      return NextResponse.json(
        { error: 'Customer has no email address' },
        { status: 400 }
      );
    }

    await sendRideConfirmation({
      customerName: ride.customer.name,
      customerEmail: ride.customer.email,
      pickupLocation: ride.pickupLocation,
      dropoffLocation: ride.dropoffLocation,
      vehicleType: ride.vehicleType,
      passengers: ride.passengers,
      totalFare: ride.quoteAmount,
      status: ride.status
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}