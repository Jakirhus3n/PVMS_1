import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, Filter, Calendar, MapPin, Users, AlertTriangle } from 'lucide-react';
import { BANGLADESH_DIVISIONS, POLITICAL_PARTIES, SEVERITY_LEVELS } from '@/lib/constants';
import type { IncidentFilter } from '@shared/schema';

interface FiltersSidebarProps {
  filters: IncidentFilter;
  onFilterChange: (filters: Partial<IncidentFilter>) => void;
  language: 'bn' | 'en';
}

export default function FiltersSidebar({ filters, onFilterChange, language }: FiltersSidebarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedDivision, setSelectedDivision] = useState(filters.division || 'all');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({ search: value });
  };

  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    onFilterChange({ division: value === 'all' ? '' : value, district: '' });
  };

  const handleDistrictChange = (value: string) => {
    onFilterChange({ district: value === 'all' ? '' : value });
  };

  const handlePartyChange = (value: string) => {
    onFilterChange({ party: value === 'all' ? '' : value });
  };

  const handleSeverityChange = (severity: string, checked: boolean) => {
    const currentSeverity = filters.severity || [];
    const newSeverity = checked
      ? [...currentSeverity, severity]
      : currentSeverity.filter(s => s !== severity);
    onFilterChange({ severity: newSeverity });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFilterChange({ [field]: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDivision('all');
    onFilterChange({
      search: '',
      division: '',
      district: '',
      party: '',
      severity: [],
      dateFrom: '',
      dateTo: '',
      fatalOnly: false,
      injuredOnly: false
    });
  };

  const availableDistricts = selectedDivision && selectedDivision !== 'all' ? BANGLADESH_DIVISIONS[selectedDivision as keyof typeof BANGLADESH_DIVISIONS] : [];

  return (
    <aside className="w-80 filter-card h-screen sticky top-16 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold gradient-text">
            {language === 'bn' ? 'ফিল্টার ও সার্চ' : 'Filters & Search'}
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="w-4 h-4" />
            {language === 'bn' ? 'ঘটনা খুঁজুন' : 'Search Incidents'}
          </Label>
          <div className="relative">
            <Input
              placeholder={language === 'bn' ? 'স্থান, দল, বিবরণ দিয়ে খুঁজুন...' : 'Search by location, party, description...'}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {language === 'bn' ? 'তারিখের পরিসর' : 'Date Range'}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleDateChange('dateFrom', e.target.value)}
              placeholder={language === 'bn' ? 'শুরু' : 'From'}
            />
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleDateChange('dateTo', e.target.value)}
              placeholder={language === 'bn' ? 'শেষ' : 'To'}
            />
          </div>
        </div>

        {/* Division */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {language === 'bn' ? 'বিভাগ' : 'Division'}
          </Label>
          <Select value={selectedDivision} onValueChange={handleDivisionChange}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'bn' ? 'সব বিভাগ' : 'All Divisions'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'bn' ? 'সব বিভাগ' : 'All Divisions'}</SelectItem>
              {Object.keys(BANGLADESH_DIVISIONS).map((division) => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        {selectedDivision && selectedDivision !== 'all' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {language === 'bn' ? 'জেলা' : 'District'}
            </Label>
            <Select value={filters.district || 'all'} onValueChange={handleDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'bn' ? 'সব জেলা' : 'All Districts'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'bn' ? 'সব জেলা' : 'All Districts'}</SelectItem>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Political Party */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4" />
            {language === 'bn' ? 'রাজনৈতিক দল' : 'Political Party'}
          </Label>
          <Select value={filters.party || 'all'} onValueChange={handlePartyChange}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'bn' ? 'সব দল' : 'All Parties'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'bn' ? 'সব দল' : 'All Parties'}</SelectItem>
              {POLITICAL_PARTIES.map((party) => (
                <SelectItem key={party} value={party}>
                  {party}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {language === 'bn' ? 'গুরুত্ব' : 'Severity'}
          </Label>
          <div className="space-y-2">
            {SEVERITY_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <Checkbox
                  id={level.value}
                  checked={filters.severity?.includes(level.value) || false}
                  onCheckedChange={(checked) => handleSeverityChange(level.value, checked as boolean)}
                />
                <Label
                  htmlFor={level.value}
                  className={`text-sm cursor-pointer px-2 py-1 rounded-full ${
                    level.value === 'high' ? 'severity-high' : 
                    level.value === 'medium' ? 'severity-medium' : 
                    'severity-low'
                  }`}
                >
                  {language === 'bn' ? level.labelBn : level.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Casualty Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            {language === 'bn' ? 'হতাহত' : 'Casualties'}
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fatalOnly"
                checked={filters.fatalOnly || false}
                onCheckedChange={(checked) => onFilterChange({ fatalOnly: checked as boolean })}
              />
              <Label htmlFor="fatalOnly" className="text-sm cursor-pointer">
                {language === 'bn' ? 'শুধু মৃত্যু' : 'Fatal incidents only'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="injuredOnly"
                checked={filters.injuredOnly || false}
                onCheckedChange={(checked) => onFilterChange({ injuredOnly: checked as boolean })}
              />
              <Label htmlFor="injuredOnly" className="text-sm cursor-pointer">
                {language === 'bn' ? 'শুধু আহত' : 'Injured incidents only'}
              </Label>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full btn-secondary"
        >
          {language === 'bn' ? 'সব ফিল্টার পরিষ্কার করুন' : 'Clear All Filters'}
        </Button>
      </div>
    </aside>
  );
}