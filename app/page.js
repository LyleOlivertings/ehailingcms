'use client';
import { useState } from 'react';
import { vehicleTypes } from '../lib/pricing';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function QuoteCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0]);
  const [passengers, setPassengers] = useState(1);
  const [distance, setDistance] = useState(10);
  const [quote, setQuote] = useState(null);

  const calculateQuote = () => {
    const base = selectedVehicle.baseRate;
    const distanceCost = distance * selectedVehicle.perKmRate;
    const total = base + distanceCost;
    setQuote(total);
  };

  const isValidPassengers = passengers <= selectedVehicle.maxPassengers;
  const isValidDistance = distance > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">E-Hailing Quote Calculator</h1>
          
          {/* Vehicle Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-4">
              {vehicleTypes.map((vehicle) => (
                <button
                  key={vehicle.name}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`p-4 border rounded-lg ${selectedVehicle.name === vehicle.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{vehicle.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.name}</p>
                      <p className="text-sm text-gray-500">
                        Up to {vehicle.maxPassengers} passengers
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Passengers Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Passengers
              <span className="ml-2 text-gray-400 text-sm">
                (Max {selectedVehicle.maxPassengers})
              </span>
            </label>
            <input
              type="number"
              min="1"
              max={selectedVehicle.maxPassengers}
              value={passengers}
              onChange={(e) => setPassengers(Math.min(e.target.value, selectedVehicle.maxPassengers))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {!isValidPassengers && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <InformationCircleIcon className="h-4 w-4" />
                Exceeds vehicle capacity
              </p>
            )}
          </div>

          {/* Distance Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              type="number"
              min="1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {!isValidDistance && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <InformationCircleIcon className="h-4 w-4" />
                Please enter a valid distance
              </p>
            )}
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateQuote}
            disabled={!isValidPassengers || !isValidDistance}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Calculate Quote
          </button>

          {/* Quote Display */}
          {quote && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h2 className="text-lg font-semibold text-green-800">
                Your Quote:
                <span className="ml-2 text-2xl">
                  R{quote.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </h2>
              <p className="text-sm text-green-700 mt-2">
                Breakdown: R{selectedVehicle.baseRate.toFixed(2)} base + 
                (R{selectedVehicle.perKmRate.toFixed(2)}/km × {distance}km)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}