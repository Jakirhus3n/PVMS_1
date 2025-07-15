import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, Download, Globe, Moon, Shield } from "lucide-react";
import FiltersSidebar from "@/components/filters-sidebar";
import DashboardMetrics from "@/components/dashboard-metrics";
import DashboardCharts from "@/components/dashboard-charts";
import DashboardMap from "@/components/dashboard-map";
import DashboardTimeline from "@/components/dashboard-timeline";
import IncidentCard from "@/components/incident-card";
import IncidentModal from "@/components/incident-modal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Incident, IncidentFilter } from "@shared/schema";

export default function Dashboard() {
  const [filters, setFilters] = useState<IncidentFilter>({
    page: 1,
    limit: 12,
    sortBy: 'date'
  });
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { toast } = useToast();

  const { data: incidentsData, isLoading: incidentsLoading } = useQuery({
    queryKey: ['/api/incidents', filters],
    enabled: true
  });

  const { data: statistics, isLoading: statisticsLoading } = useQuery({
    queryKey: ['/api/statistics', filters],
    enabled: true
  });

  const { data: chartData, isLoading: chartsLoading } = useQuery({
    queryKey: ['/api/charts'],
    enabled: true
  });

  const handleFilterChange = (newFilters: Partial<IncidentFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`/api/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incidents.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Export successful",
        description: "Incidents data has been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export incidents data",
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const totalPages = useMemo(() => {
    if (!incidentsData) return 0;
    return Math.ceil(incidentsData.total / (filters.limit || 12));
  }, [incidentsData, filters.limit]);

  if (incidentsLoading || statisticsLoading || chartsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Political Violence Tracker
                </h1>
                <p className="text-sm text-gray-600">রাজনৈতিক সহিংসতা ট্র্যাকার</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'EN' : 'বাং'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Moon className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs bg-red-500 text-white">
                3
              </Badge>
            </Button>
            
            <Button onClick={handleExport} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <FiltersSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange}
          language={language}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <DashboardMetrics statistics={statistics} />
              <DashboardCharts chartData={chartData} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DashboardMap incidents={incidentsData?.incidents || []} />
                </div>
                <div>
                  <DashboardTimeline incidents={incidentsData?.incidents || []} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      All Incidents ({incidentsData?.total || 0})
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        List
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        Grid
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {incidentsData?.incidents.map((incident) => (
                      <IncidentCard
                        key={incident.id}
                        incident={incident}
                        onClick={() => setSelectedIncident(incident)}
                        isCompact={viewMode === 'list'}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {((filters.page || 1) - 1) * (filters.limit || 12) + 1}-
                        {Math.min((filters.page || 1) * (filters.limit || 12), incidentsData?.total || 0)} of {incidentsData?.total || 0} incidents
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange((filters.page || 1) - 1)}
                          disabled={(filters.page || 1) === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={page === filters.page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange((filters.page || 1) + 1)}
                          disabled={(filters.page || 1) === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <DashboardCharts chartData={chartData} />
              <DashboardMetrics statistics={statistics} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Incident Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}
