import dbConnect from '@/lib/db';
import Ride from '@/models/Ride';
import Customer from '@/models/Customer';
import { RidesTrendChart } from '@/components/RidesTrendChart';

async function getDashboardData() {
  await dbConnect();

  const weeklyRides = await Ride.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 7 }
  ]);
  const [
    totalRides,
    totalRevenue,
    unpaidRides,
    recentRides,
    recentCustomers
  ] = await Promise.all([
    // Total Rides
    Ride.countDocuments(),
    
    // Total Revenue (paid rides only)
    Ride.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$quoteAmount" } } }
    ]),
    
    // Unpaid Rides
    Ride.countDocuments({ isPaid: false }),
    
    // Recent Rides (last 5)
    Ride.find().sort({ createdAt: -1 }).limit(5).populate('customer'),
    
    // Recent Customers (last 5)
    Customer.find().sort({ createdAt: -1 }).limit(5)
  ]);

  return {
    totalRides,
    totalRevenue: totalRevenue[0]?.total || 0,
    unpaidRides,
    recentRides: JSON.parse(JSON.stringify(recentRides)),
    recentCustomers: JSON.parse(JSON.stringify(recentCustomers))
  };
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Rides" 
          value={dashboardData.totalRides}
          icon="🚕"
          color="bg-blue-100"
        />
        <StatCard
          title="Total Revenue"
          value={dashboardData.totalRevenue}
          icon="💰"
          currency
          color="bg-green-100"
        />
        <StatCard
          title="Unpaid Rides"
          value={dashboardData.unpaidRides}
          icon="⚠️"
          color="bg-yellow-100"
        />
        <StatCard
          title="Active Customers"
          value={dashboardData.recentCustomers.length}
          icon="👤"
          color="bg-purple-100"
        />
      </div>

      {/* Weekly Rides Chart */}


      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRides rides={dashboardData.recentRides} />
        <RecentCustomers customers={dashboardData.recentCustomers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <RidesTrendChart data={dashboardData.weeklyRides} />
 
</div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, currency = false }) {
  return (
    <div className={`p-6 rounded-xl ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-2">
            {currency ? 'R' : ''}{currency ? value.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) : value}
          </p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

// Recent Rides Component
function RecentRides({ rides }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
      <div className="space-y-3">
        {rides.map((ride) => (
          <div key={ride._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
            <div>
              <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
              <p className="text-sm text-gray-500">{ride.vehicleType}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">R{ride.quoteAmount.toFixed(2)}</p>
              <span className={`text-sm ${ride.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                {ride.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>
        ))}
        {rides.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent rides</p>
        )}
      </div>
    </div>
  );
}

// Recent Customers Component
function RecentCustomers({ customers }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Customers</h2>
      <div className="space-y-3">
        {customers.map((customer) => (
          <div key={customer._id} className="flex items-center p-3 hover:bg-gray-50 rounded">
            <div className="flex-1">
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.phone}</p>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(customer.createdAt).toLocaleDateString('en-ZA')}
            </span>
          </div>
        ))}
        {customers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent customers</p>
        )}
      </div>
    </div>
  );
}