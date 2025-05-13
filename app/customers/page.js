import Link from 'next/link';
import Customer from '@/models/Customer';
import dbConnect from '@/lib/db';

async function getCustomers() {
  await dbConnect();
  return await Customer.find().sort({ createdAt: -1 });
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Customers</h1>
        <Link href="/new-customer" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          New Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total Rides</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Registered</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/customers/${customer._id}`} className="text-blue-600 hover:underline">
                    {customer.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* We'll add ride count later */}
                  0
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(customer.createdAt).toLocaleDateString('en-ZA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';