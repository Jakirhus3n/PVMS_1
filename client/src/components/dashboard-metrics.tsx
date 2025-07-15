import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, UserX, Users, Bot, TrendingUp } from "lucide-react";

interface DashboardMetricsProps {
  statistics: {
    totalIncidents: number;
    totalKilled: number;
    totalInjured: number;
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    avgConfidence: number;
  } | undefined;
}

export default function DashboardMetrics({ statistics }: DashboardMetricsProps) {
  if (!statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalCasualties = statistics.totalKilled + statistics.totalInjured;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalIncidents}</p>
              <p className="text-sm text-blue-600">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                All recorded incidents
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-blue-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Casualties</p>
              <p className="text-2xl font-bold text-gray-900">{totalCasualties}</p>
              <p className="text-sm text-red-600">
                <UserX className="inline w-3 h-3 mr-1" />
                {statistics.totalKilled} killed, {statistics.totalInjured} injured
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="text-red-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">High Severity</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.highSeverityCount}</p>
              <p className="text-sm text-orange-600">
                Critical incidents requiring attention
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-orange-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">AI Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(statistics.avgConfidence * 100)}%
              </p>
              <p className="text-sm text-green-600">
                <Bot className="inline w-3 h-3 mr-1" />
                Average analysis confidence
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bot className="text-green-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
