import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { fr } from 'date-fns/locale';

export const DATE_RANGES = [
  { label: '7 derniers jours', days: 7 },
  { label: '30 derniers jours', days: 30 },
  { label: '90 derniers jours', days: 90 }
];

interface DateRangeFilterProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
}

export default function DateRangeFilter({ 
  dateRange, 
  setDateRange, 
  showDatePicker, 
  setShowDatePicker 
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-700">
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy')
              )
            ) : (
              'Sélectionner une période'
            )}
          </span>
          <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
        </button>

        {showDatePicker && (
          <div className="absolute z-10 mt-2">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange({ from: range?.from, to: range?.to });
                setShowDatePicker(false);
              }}
              locale={fr}
            />
          </div>
        )}
      </div>

      {DATE_RANGES.map(range => (
        <button
          key={range.days}
          onClick={() => setDateRange({
            from: subDays(new Date(), range.days),
            to: new Date()
          })}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}