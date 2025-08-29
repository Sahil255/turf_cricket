'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, IndianRupee, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PricingSlot {
  id: string;
  turf_id: string;
  start_time: string;
  end_time: string;
  price_per_hour: number;
}

interface Turf {
  id: string;
  name: string;
}

export default function AdminPricing() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<string>('');
  const [pricingSlots, setPricingSlots] = useState<PricingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<PricingSlot | null>(null);
  const [formData, setFormData] = useState({
    start_time: '06:00',
    end_time: '12:00',
    price_per_hour: 500,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (selectedTurf) {
      fetchPricingSlots(selectedTurf);
    }
  }, [selectedTurf]);

  const fetchTurfs = async () => {
    try {
      const response = await fetch('/api/turfs');
      const { turfs } = await response.json();
      setTurfs(turfs || []);
      if (turfs && turfs.length > 0) {
        setSelectedTurf(turfs[0].id);
      }
    } catch (error) {
      console.error('Error fetching turfs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingSlots = async (turfId: string) => {
    try {
      const response = await fetch(`/api/pricing-slots?turfId=${turfId}`);
      const { slots } = await response.json();
      setPricingSlots(slots || []);
    } catch (error) {
      console.error('Error fetching pricing slots:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTurf) return;

    const slotData = {
      turf_id: selectedTurf,
      ...formData,
    };

    try {
      const response = await fetch(
        editingSlot ? `/api/pricing-slots/${editingSlot.id}` : '/api/pricing-slots',
        {
          method: editingSlot ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slotData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Pricing slot ${editingSlot ? 'updated' : 'created'} successfully`,
        });
        setDialogOpen(false);
        setEditingSlot(null);
        setFormData({
          start_time: '06:00',
          end_time: '12:00',
          price_per_hour: 500,
        });
        fetchPricingSlots(selectedTurf);
      } else {
        const { error } = await response.json();
        toast({
          title: "Error",
          description: error || 'Failed to save pricing slot',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving pricing slot:', error);
      toast({
        title: "Error",
        description: "Failed to save pricing slot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (slot: PricingSlot) => {
    setEditingSlot(slot);
    setFormData({
      start_time: slot.start_time,
      end_time: slot.end_time,
      price_per_hour: slot.price_per_hour,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this pricing slot?')) return;

    try {
      const response = await fetch(`/api/pricing-slots/${slotId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pricing slot deleted successfully",
        });
        fetchPricingSlots(selectedTurf);
      } else {
        const { error } = await response.json();
        toast({
          title: "Error",
          description: error || 'Failed to delete pricing slot',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting pricing slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete pricing slot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600">Configure dynamic pricing for different time slots</p>
        </div>
      </div>

      {/* Turf Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Turf</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedTurf}
            onChange={(e) => setSelectedTurf(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a turf</option>
            {turfs.map((turf) => (
              <option key={turf.id} value={turf.id}>
                {turf.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedTurf && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                Pricing Slots
              </CardTitle>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setEditingSlot(null);
                      setFormData({
                        start_time: '06:00',
                        end_time: '12:00',
                        price_per_hour: 500,
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Pricing Slot
                  </Button>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSlot ? 'Edit Pricing Slot' : 'Add New Pricing Slot'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={formData.start_time}
                          onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={formData.end_time}
                          onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_per_hour">Price per Hour (₹)</Label>
                      <Input
                        id="price_per_hour"
                        type="number"
                        value={formData.price_per_hour}
                        onChange={(e) => setFormData({...formData, price_per_hour: parseInt(e.target.value)})}
                        placeholder="500"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        {editingSlot ? 'Update' : 'Create'} Slot
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : pricingSlots.length > 0 ? (
              <div className="space-y-3">
                {pricingSlots.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-green-700 font-semibold">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {slot.price_per_hour}/hour
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(slot)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(slot.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <IndianRupee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Pricing Slots
                </h3>
                <p className="text-gray-600">
                  Add pricing slots to configure dynamic pricing for this turf.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}