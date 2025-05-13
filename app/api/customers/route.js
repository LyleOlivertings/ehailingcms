import { NextResponse } from 'next/server';
import Customer from '@/models/Customer';
import dbConnect from '@/lib/db';

export async function GET() {
  await dbConnect();
  const customers = await Customer.find().sort({ createdAt: -1 });
  return NextResponse.json(customers);
}