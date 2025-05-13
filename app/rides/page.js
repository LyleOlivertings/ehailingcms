"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function RidesPage() {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRides() {
      try {
        const res = await fetch("/api/rides");
        const data = await res.json();
        setRides(data);
      } catch (error) {
        toast.error("Failed to load rides");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRides();
  }, []);

  const generateEmailText = (ride) => {
    return `Subject: Your Cape Rides Booking Confirmation
  
  Hi ${ride.customer?.name || "Valued Customer"},
  
  Your ride with Cape Rides has been confirmed. Here are your details:
  
  📍 Pickup: ${ride.pickupLocation || "To be confirmed"}
  📍 Dropoff: ${ride.dropoffLocation || "To be confirmed"}
  🚗 Vehicle Type: ${ride.vehicleType}
  👥 Passengers: ${ride.passengers}
  💵 Total Fare: R${ride.quoteAmount.toFixed(2)}
  📆 Booking Date: ${new Date(ride.createdAt).toLocaleDateString("en-ZA")}
  🔄 Status: ${ride.status}
  
  Need to make changes? Contact us at +27 21 123 4567
  
  Safe travels,
  The Cape Rides Team
  `;
  };

  const [copiedRideId, setCopiedRideId] = useState(null);

  const handleCopyEmailText = async (ride) => {
    try {
      await navigator.clipboard.writeText(generateEmailText(ride));
      setCopiedRideId(ride._id);
      setTimeout(() => setCopiedRideId(null), 2000);
      toast.success("Email text copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  const handlePaidToggle = async (rideId, currentStatus) => {
    const originalRides = [...rides];
    try {
      // Optimistic update
      setRides((prev) =>
        prev.map((ride) =>
          ride._id === rideId ? { ...ride, isPaid: !currentStatus } : ride
        )
      );

      const res = await fetch(`/api/rides/${rideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !currentStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Payment status updated");
      router.refresh(); // Refresh server data
    } catch (error) {
      setRides(originalRides);
      toast.error("Failed to update payment status");
    }
  };

  const handleStatusChange = async (rideId, newStatus) => {
    const originalRides = [...rides];
    try {
      // Optimistic update
      setRides((prev) =>
        prev.map((ride) =>
          ride._id === rideId ? { ...ride, status: newStatus } : ride
        )
      );

      const res = await fetch(`/api/rides/${rideId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      toast.success("Ride status updated");
      router.refresh();
    } catch (error) {
      setRides(originalRides);
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Rides</h1>
        <Link
          href="/new-ride"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          New Ride
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Paid
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rides.map((ride) => (
              <tr key={ride._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {ride.customer?.name || "Unknown Customer"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ride.vehicleType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  R{ride.quoteAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(ride.createdAt).toLocaleDateString("en-ZA")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={ride.status}
                    onChange={(e) =>
                      handleStatusChange(ride._id, e.target.value)
                    }
                    className={`px-2 py-1 text-sm rounded-full ${
                      ride.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : ride.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : ride.status === "confirmed"
                        ? "bg-purple-100 text-purple-800"
                        : ride.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handlePaidToggle(ride._id, ride.isPaid)}
                    className={`p-1 rounded-full ${
                      ride.isPaid ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {ride.isPaid ? (
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-red-600" />
                    )}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleCopyEmailText(ride)}
                    className="text-gray-600 hover:text-blue-600 tooltip"
                    title="Copy email text"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                    {copiedRideId === ride._id && (
                      <span className="absolute bg-black text-white px-2 py-1 rounded text-sm ml-2">
                        Copied!
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rides.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No rides found</p>
          </div>
        )}
      </div>
    </div>
  );
}
