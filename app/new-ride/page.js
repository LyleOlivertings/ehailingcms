"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { vehicleTypes } from "@/lib/pricing";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function NewRidePage() {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0]);
  const [quote, setQuote] = useState(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    vehicleType: vehicleTypes[0].name,
    passengers: 1,
    distance: 10,
    pickupLocation: "",
    dropoffLocation: "",
  });

  // Calculate quote whenever relevant fields change

  const calculateQuote = () => {
    const vehicle = vehicleTypes.find((v) => v.name === formData.vehicleType);
    const base = vehicle.baseRate;
    const distanceCost = formData.distance * vehicle.perKmRate;
    setQuote(base + distanceCost);
  };

  useEffect(() => {
    calculateQuote();
  }, [formData.vehicleType, formData.passengers, formData.distance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "passengers" || name === "distance" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const vehicle = vehicleTypes.find((v) => v.name === formData.vehicleType);
    if (formData.passengers > vehicle.maxPassengers) {
      setError("Passengers exceed vehicle capacity");
      return;
    }

    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quoteAmount: quote,
        }),
      });

      if (!res.ok) throw new Error("Failed to create ride");
      router.push("/rides");
    } catch (err) {
      setError(err.message || "Failed to create ride");
    }
  };

  const isValidPassengers =
    formData.passengers <= selectedVehicle.maxPassengers;
  const isValidDistance = formData.distance > 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Ride</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="customerName"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.customerName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="customerPhone"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.customerPhone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              title="10-digit South African phone number"
            />
          </div>
        </div>

        {/* Ride Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Ride Information</h2>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Vehicle Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {vehicleTypes.map((vehicle) => (
                <button
                  type="button"
                  key={vehicle.name}
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setFormData((prev) => ({
                      ...prev,
                      vehicleType: vehicle.name,
                      passengers: Math.min(
                        prev.passengers,
                        vehicle.maxPassengers
                      ),
                    }));
                  }}
                  className={`p-4 border rounded-lg ${
                    formData.vehicleType === vehicle.name
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{vehicle.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {vehicle.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Max {vehicle.maxPassengers} passengers
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Passengers Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Passengers *
              <span className="ml-2 text-gray-400 text-sm">
                (Max {selectedVehicle.maxPassengers})
              </span>
            </label>
            <input
              type="number"
              name="passengers"
              min="1"
              max={selectedVehicle.maxPassengers}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.passengers}
              onChange={handleInputChange}
            />
            {!isValidPassengers && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <InformationCircleIcon className="h-4 w-4" />
                Exceeds vehicle capacity
              </p>
            )}
          </div>

          {/* Distance Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Distance (km) *
            </label>
            <input
              type="number"
              name="distance"
              min="1"
              step="0.1"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.distance}
              onChange={handleInputChange}
            />
            {!isValidDistance && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <InformationCircleIcon className="h-4 w-4" />
                Please enter a valid distance
              </p>
            )}
          </div>

          {/* Location Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                name="pickupLocation"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.pickupLocation}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Dropoff Location
              </label>
              <input
                type="text"
                name="dropoffLocation"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.dropoffLocation}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Quote Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Estimated Quote</h3>
            <span className="text-xl font-bold text-blue-600">
              R{quote.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValidPassengers || !isValidDistance}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Ride
        </button>
      </form>
    </div>
  );
}
