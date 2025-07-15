import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, UserX } from "lucide-react";
import type { Incident } from "@shared/schema";

interface DashboardTimelineProps {
  incidents: Incident[];
}

export default function DashboardTimeline({ incidents }: DashboardTimelineProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const incidentDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const recentIncidents = incidents.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentIncidents.map((incident) => (
            <div key={incident.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getSeverityColor(incident.severity)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {incident.division} - {incident.district}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {incident.severity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600 mb-1">
                  <span className="flex items-center">
                    <UserX className="w-3 h-3 mr-1" />
                    {incident.killed} killed
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {incident.injured} injured
                  </span>
                </div>
                <p className="text-xs text-gray-500">{getTimeAgo(incident.date)}</p>
              </div>
            </div>
          ))}
          
          {incidents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent incidents to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
