'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Turf {
  id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  opening_time: string;
  closing_time: string;
  active: boolean;
}

export default function AdminTurfs() {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTurf, setEditingTurf] = useState<Turf | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    images: '',
    opening_time: '06:00',
    closing_time: '21:00',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTurfs();
  }, []);


  const fetchTurfs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/turfs')
      if (response.ok) {
        const data = await response.json()
        
        setTurfs(data)
        //  if (data && data.length === 1) {
        //   router.push(`/turfs/${data[0].id}`);
        // }
      }
      else{
        console.error('Error fetching turfs');
        toast({
          title: "Error",
          description: 'Failed to load the page',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching turfs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const images = formData.images.split('\n').filter(url => url.trim());
    const turfData = {
      ...formData,
      images,
    };

    try {
      const response = await fetch(
        editingTurf ? `/api/turfs/${editingTurf.id}` : '/api/turfs',
        {
          method: editingTurf ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(turfData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `Turf ${editingTurf ? 'updated' : 'created'} successfully`,
        });
        setDialogOpen(false);
        setEditingTurf(null);
        setFormData({
          name: '',
          location: '',
          description: '',
          images: '',
          opening_time: '06:00',
          closing_time: '22:00',
        });
        fetchTurfs();
      } else {
        const { error } = await response.json();
        toast({
          title: "Error",
          description: error || 'Failed to save turf',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving turf:', error);
      toast({
        title: "Error",
        description: "Failed to save turf. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (turf: Turf) => {
    setEditingTurf(turf);
    setFormData({
      name: turf.name,
      location: turf.location,
      description: turf.description,
      images: turf.images.join('\n'),
      opening_time: turf.opening_time,
      closing_time: turf.closing_time,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (turfId: string) => {
    if (!confirm('Are you sure you want to delete this turf?')) return;

    try {
      const response = await fetch(`/api/turfs/${turfId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Turf deleted successfully",
        });
        fetchTurfs();
      } else {
        const { error } = await response.json();
        toast({
          title: "Error", 
          description: error || 'Failed to delete turf',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting turf:', error);
      toast({
        title: "Error",
        description: "Failed to delete turf. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turf Management</h1>
          <p className="text-gray-600">Manage your cricket turfs and facilities</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setEditingTurf(null);
                setFormData({
                  name: '',
                  location: '',
                  description: '',
                  images: '',
                  opening_time: '06:00',
                  closing_time: '22:00',
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Turf
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTurf ? 'Edit Turf' : 'Add New Turf'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Turf Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Green Valley Cricket Turf"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Sector 18, Noida, UP"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Professional cricket turf with modern facilities..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening_time">Opening Time</Label>
                  <Input
                    id="opening_time"
                    type="time"
                    value={formData.opening_time}
                    onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="closing_time">Closing Time</Label>
                  <Input
                    id="closing_time"
                    type="time"
                    value={formData.closing_time}
                    onChange={(e) => setFormData({...formData, closing_time: e.target.value})}
                    required
                  />
                </div>
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
                  {editingTurf ? 'Update' : 'Create'} Turf
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Turfs List */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {turfs.map((turf) => (
            <Card key={turf.id}>
              <div className="relative">
                <img
                  src={turf.images[0] || 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg'}
                  alt={turf.name}
                  className="w-full h-48 object-cover"
                />
                <Badge 
                  className={`absolute top-3 right-3 ${turf.active ? 'bg-green-600' : 'bg-red-600'}`}
                >
                  {turf.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">{turf.name}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {turf.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {turf.opening_time} - {turf.closing_time}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{turf.description}</p>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(turf)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(turf.id)}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}