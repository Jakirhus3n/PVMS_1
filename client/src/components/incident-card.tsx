import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserX, Bot, Camera } from "lucide-react";
import type { Incident } from "@shared/schema";

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
  isCompact?: boolean;
}

export default function IncidentCard({ incident, onClick, isCompact = false }: IncidentCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'উচ্চ';
      case 'medium': return 'মধ্যম';
      case 'low': return 'নিম্ন';
      default: return 'অজানা';
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${
        incident.severity === 'high' ? 'border-l-4 border-l-red-600' : 
        incident.severity === 'medium' ? 'border-l-4 border-l-orange-500' : 
        'border-l-4 border-l-green-500'
      }`}
      onClick={onClick}
    >
      <CardContent className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs ${getSeverityColor(incident.severity)}`}>
                {getSeverityLabel(incident.severity)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {incident.newsSource}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(incident.date).toLocaleDateString('bn-BD')}
              </span>
            </div>
            
            <h4 className="font-medium text-sm mb-1">{incident.location}</h4>
            
            {incident.images && incident.images.length > 0 && !isCompact && (
              <div className="mb-3">
                <img 
                  src={incident.images[0]} 
                  alt="Incident"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
            
            <p className={`text-gray-600 text-sm ${isCompact ? 'line-clamp-2' : 'line-clamp-3'}`}>
              {incident.description}
            </p>
            
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1 text-red-600">
                <UserX className="h-3 w-3" />
                {incident.killed} নিহত
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <Users className="h-3 w-3" />
                {incident.injured} আহত
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <Bot className="h-3 w-3" />
                {Math.round(incident.aiAnalysis.confidence * 100)}%
              </span>
            </div>
            
            {incident.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {incident.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="ml-3 flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {incident.party.length > 15 ? incident.party.substring(0, 15) + '...' : incident.party}
            </Badge>
            {incident.images && incident.images.length > 0 && (
              <Camera className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
