'use client'

import { useState, useEffect } from 'react'
import { TurfCard } from '@/components/turf/TurfCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MapPin } from 'lucide-react'
import { Turf } from '@/types'

export default function TurfsPage() {
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    try {
      const response = await fetch('/api/turfs')
      if (response.ok) {
        const data = await response.json()
        setTurfs(data)
      }
    } catch (error) {
      console.error('Error fetching turfs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTurfs = turfs.filter(turf => {
    const matchesSearch = turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || turf.location.toLowerCase().includes(selectedLocation.toLowerCase())
    return matchesSearch && matchesLocation
  })

  const locations = [...new Set(turfs.map(turf => turf.location))]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Book Cricket Turfs</h1>
        <p className="text-gray-600 mb-6">
          Find and book the perfect cricket turf for your game
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search turfs by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedLocation === '' ? 'default' : 'outline'}
              onClick={() => setSelectedLocation('')}
              className="whitespace-nowrap"
            >
              All Locations
            </Button>
            {locations.slice(0, 3).map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? 'default' : 'outline'}
                onClick={() => setSelectedLocation(location)}
                className="whitespace-nowrap"
              >
                {location}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredTurfs.length} turf{filteredTurfs.length !== 1 ? 's' : ''} found
          </p>
          
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center">
              <Search className="h-3 w-3 mr-1" />
              "{searchTerm}"
            </Badge>
          )}
        </div>
      </div>

      {/* Turfs Grid */}
      {filteredTurfs.length > 0 ? 
      filteredTurfs.length == 1?
      (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      ) :
      (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      )
       : (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No turfs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No turfs match your search "${searchTerm}"`
                : 'No turfs available at the moment'
              }
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}