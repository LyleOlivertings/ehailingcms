import Customer from '@/models/Customer';
import Ride from '@/models/Ride';
import dbConnect from '@/lib/db';
import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

async function getCustomerData(id) {
    await dbConnect();
    const customer = await Customer.findById(id);
    const rides = await Ride.find({ customer: id }).sort({ createdAt: -1 });
    return { customer, rides };
  }
  

export default async function CustomerDetail({ params }) {
  const { customer, rides } = await getCustomerData(params.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserIcon className="h-6 w-6" />
            {customer.name}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <PhoneIcon className="h-4 w-4" />
            {customer.phone}
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <EnvelopeIcon className="h-4 w-4" />
              {customer.email}
            </div>
          )}
        </div>
        <Link
          href={`/customers/${customer._id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Edit Profile
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Ride History</h2>
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride._id.toString()} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{ride.vehicleType}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(ride.createdAt).toLocaleDateString('en-ZA')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R{ride.quoteAmount.toFixed(2)}</p>
                  <p className={`text-sm ${ride.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {ride.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {rides.length === 0 && (
            <p className="text-gray-500 text-center py-4">No rides found for this customer</p>
          )}
        </div>
      </div>

      {customer.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Driver Notes</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{customer.notes}</p>
        </div>
      )}
    </div>
  );
}