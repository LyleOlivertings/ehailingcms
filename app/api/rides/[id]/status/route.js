import { NextResponse } from 'next/server';
import Ride from '@/models/Ride';
import dbConnect from '@/lib/db';

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = params;
  
  try {
    const { status } = await request.json();
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'canceled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const ride = await Ride.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ride);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}