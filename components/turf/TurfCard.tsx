import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Users } from 'lucide-react'
import { Turf } from '@/types'

interface TurfCardProps {
  turf: Turf
}

export function TurfCard({ turf }: TurfCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={turf.images[0] || 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'}
          alt={turf.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            4.8
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{turf.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{turf.location}</span>
        </div>
        
        {turf.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {turf.description}
          </p>
        )}
        
        {/* <div className="flex flex-wrap gap-1 mb-3">
          {turf.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {turf.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{turf.amenities.length - 3} more
            </Badge>
          )}
        </div> */}
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>22 players</span>
          </div>
          <div className="font-semibold text-green-600">
            From ₹800/hour
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/turfs/${turf.id}`}>
            View Details & Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}