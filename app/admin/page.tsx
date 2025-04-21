'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type Booking = {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  details: string | null;
  status: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.bookings);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update booking');
      
      // Refresh bookings after update
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status.toLowerCase() === filter
  );

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking Management</h1>
        
        {/* Filter Controls */}
        <div className="mb-6 flex gap-4">
          <Button 
            variant={filter === 'all' ? 'default' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'secondary'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'confirmed' ? 'default' : 'secondary'}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </Button>
          <Button 
            variant={filter === 'cancelled' ? 'default' : 'secondary'}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </Button>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Event Type</th>
                <th className="text-left p-4">Event Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-neutral-800 hover:bg-neutral-900">
                  <td className="p-4">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</td>
                  <td className="p-4">{booking.name}</td>
                  <td className="p-4">{booking.email}</td>
                  <td className="p-4">{booking.eventType}</td>
                  <td className="p-4">{format(new Date(booking.eventDate), 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                        >
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'CANCELLED' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'PENDING')}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 