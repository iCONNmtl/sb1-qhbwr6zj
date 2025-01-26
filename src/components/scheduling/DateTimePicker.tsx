import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import clsx from 'clsx';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export default function DateTimePicker({ value, onChange, minDate = new Date(), className }: DateTimePickerProps) {
  // Générer les options d'heures (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(value.getHours());
    onChange(newDate);
  };

  const handleTimeChange = (newValue: number) => {
    const newDate = new Date(value);
    newDate.setHours(newValue, 0, 0, 0);
    onChange(newDate);
  };

  // Vérifier si une heure est dans le passé
  const isTimeInPast = (hour: number) => {
    const now = new Date();
    const selectedDate = new Date(value);
    
    if (selectedDate.getFullYear() === now.getFullYear() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getDate() === now.getDate()) {
      return hour <= now.getHours();
    }
    return false;
  };

  return (
    <div className={clsx('flex flex-col space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="h-4 w-4 inline-block mr-2" />
            Date
          </label>
          <input
            type="date"
            value={value.toISOString().split('T')[0]}
            min={minDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="h-4 w-4 inline-block mr-2" />
            Heure
          </label>
          <select
            value={value.getHours()}
            onChange={(e) => handleTimeChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {hours.map(hour => (
              <option 
                key={hour} 
                value={hour}
                disabled={isTimeInPast(hour)}
              >
                {hour.toString().padStart(2, '0')}h00
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          <span className="font-medium">Note :</span> Les publications sont programmées selon votre fuseau horaire local ({Intl.DateTimeFormat().resolvedOptions().timeZone}).
        </p>
      </div>
    </div>
  );
}