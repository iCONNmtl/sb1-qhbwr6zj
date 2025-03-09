import React, { useState } from 'react';
import { Filter, XCircle } from 'lucide-react';
import DateRangeFilter from './DateRangeFilter';
import FilterDropdown from './FilterDropdown';
import { PLATFORMS, SIZES, METRICS, COUNTRY_FLAGS } from './constants';
import clsx from 'clsx';
import type { OrderPlatform } from '../../types/order';

interface FiltersProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  selectedPlatforms: OrderPlatform[];
  setSelectedPlatforms: (platforms: OrderPlatform[]) => void;
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  availableCountries: string[];
}

export default function Filters({
  dateRange,
  setDateRange,
  showDatePicker,
  setShowDatePicker,
  selectedPlatforms,
  setSelectedPlatforms,
  selectedCountries,
  setSelectedCountries,
  selectedMetrics,
  setSelectedMetrics,
  selectedSizes,
  setSelectedSizes,
  availableCountries
}: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const togglePlatform = (platform: OrderPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(m => m !== metricId)
        : [...prev, metricId]
    );
  };

  const toggleSize = (sizeId: string) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(s => s !== sizeId)
        : [...prev, sizeId]
    );
  };

  const hasActiveFilters = selectedPlatforms.length > 0 || 
                          selectedCountries.length > 0 || 
                          selectedSizes.length > 0 || 
                          dateRange.from || 
                          dateRange.to;

  const resetFilters = () => {
    setSelectedPlatforms([]);
    setSelectedCountries([]);
    setSelectedSizes([]);
    setDateRange({ from: undefined, to: undefined });
    setShowDatePicker(false);
    setOpenDropdown(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Filter className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Filtres</h3>
            {hasActiveFilters && (
              <p className="text-sm text-gray-500 mt-1">
                {[
                  selectedPlatforms.length && `${selectedPlatforms.length} plateforme${selectedPlatforms.length > 1 ? 's' : ''}`,
                  selectedCountries.length && `${selectedCountries.length} pays`,
                  selectedSizes.length && `${selectedSizes.length} taille${selectedSizes.length > 1 ? 's' : ''}`,
                  dateRange.from && 'Période personnalisée'
                ].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Date Range Filter */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Période</div>
          <DateRangeFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />
        </div>

        {/* Platform, Country, and Size Filters */}
        <div className="grid grid-cols-3 gap-4">
          <FilterDropdown
            label={`Plateformes${selectedPlatforms.length ? ` (${selectedPlatforms.length})` : ''}`}
            isOpen={openDropdown === 'platforms'}
            onToggle={() => toggleDropdown('platforms')}
          >
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    selectedPlatforms.includes(platform.id)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                  style={{
                    backgroundColor: selectedPlatforms.includes(platform.id) 
                      ? platform.color 
                      : undefined
                  }}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </FilterDropdown>

          <FilterDropdown
            label={`Pays${selectedCountries.length ? ` (${selectedCountries.length})` : ''}`}
            isOpen={openDropdown === 'countries'}
            onToggle={() => toggleDropdown('countries')}
          >
            <div className="flex flex-wrap gap-2">
              {availableCountries.map(country => (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                    selectedCountries.includes(country)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <span className="text-base" role="img" aria-label={`Drapeau ${country}`}>
                    {COUNTRY_FLAGS[country] || '🌍'}
                  </span>
                  {country}
                </button>
              ))}
            </div>
          </FilterDropdown>

          <FilterDropdown
            label={`Tailles${selectedSizes.length ? ` (${selectedSizes.length})` : ''}`}
            isOpen={openDropdown === 'sizes'}
            onToggle={() => toggleDropdown('sizes')}
          >
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => toggleSize(size.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    selectedSizes.includes(size.id)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                  style={{
                    backgroundColor: selectedSizes.includes(size.id) 
                      ? size.color 
                      : undefined
                  }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </FilterDropdown>
        </div>

        {/* Metrics Selection */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Métriques à afficher</div>
          <div className="flex flex-wrap gap-2">
            {METRICS.map(metric => (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  selectedMetrics.includes(metric.id)
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                style={{
                  backgroundColor: selectedMetrics.includes(metric.id) 
                    ? metric.color 
                    : undefined
                }}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}