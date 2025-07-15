import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Satellite } from "lucide-react";
import { useState } from "react";
import type { Incident } from "@shared/schema";

interface DashboardMapProps {
  incidents: Incident[];
}

export default function DashboardMap({ incidents }: DashboardMapProps) {
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Incident Locations</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={mapMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapMode('map')}
            >
              <Map className="w-4 h-4 mr-1" />
              Map
            </Button>
            <Button 
              variant={mapMode === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapMode('satellite')}
            >
              <Satellite className="w-4 h-4 mr-1" />
              Satellite
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
          {/* Bangladesh coastline background */}
          <div className="absolute inset-0 bg-blue-100 opacity-30"></div>
          
          {/* Map content */}
          <div className="text-center text-gray-600 relative z-10">
            <Map className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium mb-2">Interactive Map of Bangladesh</p>
            <p className="text-sm text-gray-500 mb-4">
              Showing {incidents.length} incident locations with severity indicators
            </p>
            
            {/* Legend */}
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full mr-1"></div>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
          
          {/* Mock incident markers positioned across Bangladesh */}
          {incidents.slice(0, 8).map((incident, index) => {
            const positions = [
              { top: '20%', left: '35%' }, // Dhaka area
              { top: '35%', right: '25%' }, // Chittagong area
              { top: '25%', left: '20%' }, // Rajshahi area
              { top: '45%', left: '25%' }, // Khulna area
              { top: '55%', left: '35%' }, // Barisal area
              { top: '15%', right: '35%' }, // Sylhet area
              { top: '10%', left: '30%' }, // Rangpur area
              { top: '18%', left: '40%' }, // Mymensingh area
            ];
            
            const position = positions[index % positions.length];
            
            return (
              <div
                key={incident.id}
                className={`absolute w-4 h-4 rounded-full animate-pulse cursor-pointer ${getSeverityColor(incident.severity)} border-2 border-white shadow-lg`}
                style={position}
                title={`${incident.location} - ${incident.severity} severity`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
