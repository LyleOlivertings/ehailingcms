'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function EditCustomer({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    async function fetchCustomer() {
      const res = await fetch(`/api/customers/${params.id}`);
      const data = await res.json();
      setFormData(data);
    }
    fetchCustomer();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/customers/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      router.push(`/customers/${params.id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="h-6 w-6" />
        Edit Customer
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <div className="relative">
            <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="relative">
            <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              name="phone"
              required
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              pattern="[0-9]{10}"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              className="w-full pl-10 p-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}