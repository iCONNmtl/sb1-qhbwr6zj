import type { PopoverContentProps } from '@radix-ui/react-popover';
import {
  type HexColor,
  hexToHsva,
  type HslaColor,
  hslaToHsva,
  type HsvaColor,
  hsvaToHex,
  hsvaToHsla,
  hsvaToRgba,
  type RgbaColor,
  rgbaToHsva,
} from '@uiw/color-convert';
import Hue from '@uiw/react-color-hue';
import Saturation from '@uiw/react-color-saturation';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Separator } from './separator';
import { cn } from '../../lib/utils';

interface ColorPickerValue {
  hex: string;
  rgb: RgbaColor;
  hsl: HslaColor;
}

interface ColorPickerProps extends Omit<PopoverContentProps, 'content'> {
  value?: string | HexColor | RgbaColor | HslaColor;
  type?: 'hex' | 'rgb' | 'hsl';
  swatches?: string[];
  hideDefaultSwatches?: boolean;
  onValueChange?: (value: ColorPickerValue) => void;
}

interface ObjectColorInputProps {
  value: RgbaColor | HslaColor;
  label: string;
  onValueChange?: (value: RgbaColor | HslaColor) => void;
}

function getColorAsHsva(color: string | HexColor | RgbaColor | HslaColor): HsvaColor {
  if (typeof color === 'string') {
    return hexToHsva(color);
  }
  if ('r' in color) {
    return rgbaToHsva(color);
  }
  if ('h' in color) {
    return hslaToHsva(color);
  }
  return hexToHsva(color);
}

function ColorPicker({
  value,
  children,
  type = 'hsl',
  swatches = [],
  hideDefaultSwatches,
  onValueChange,
  className,
  ...props
}: ColorPickerProps) {
  const [colorType, setColorType] = React.useState(type);
  const [colorHsv, setColorHsv] = React.useState<HsvaColor>(value ? getColorAsHsva(value) : { h: 0, s: 0, v: 0, a: 1 });

  const handleValueChange = (color: HsvaColor) => {
    setColorHsv(color);
    onValueChange?.({
      hex: hsvaToHex(color),
      hsl: hsvaToHsla(color),
      rgb: hsvaToRgba(color),
    });
  };

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn('w-[350px] p-4 bg-white rounded-lg shadow-lg', className)}
        {...props}
      >
        <div className="space-y-4">
          <Saturation
            hsva={colorHsv}
            onChange={handleValueChange}
            style={{
              width: '100%',
              height: '150px',
              borderRadius: '0.5rem',
            }}
            className="border border-gray-200"
          />
          <Hue
            hue={colorHsv.h}
            onChange={(newHue) => handleValueChange({ ...colorHsv, ...newHue })}
            className="rounded-lg"
            style={{
              width: '100%',
              height: '12px',
              borderRadius: '0.5rem',
            }}
          />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white w-24 justify-between">
                  {colorType.toUpperCase()}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuCheckboxItem 
                  checked={colorType === 'hex'} 
                  onCheckedChange={() => setColorType('hex')}
                  className="bg-white hover:bg-gray-100"
                >
                  HEX
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={colorType === 'rgb'} 
                  onCheckedChange={() => setColorType('rgb')}
                  className="bg-white hover:bg-gray-100"
                >
                  RGB
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={colorType === 'hsl'} 
                  onCheckedChange={() => setColorType('hsl')}
                  className="bg-white hover:bg-gray-100"
                >
                  HSL
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1">
              {colorType === 'hex' && (
                <Input
                  value={hsvaToHex(colorHsv)}
                  onChange={(e) => {
                    try {
                      const newColor = hexToHsva(e.target.value);
                      handleValueChange(newColor);
                    } catch (error) {
                      // Ignore invalid hex values
                    }
                  }}
                  className="bg-white"
                />
              )}
              {colorType === 'rgb' && (
                <ObjectColorInput
                  value={hsvaToRgba(colorHsv)}
                  label="rgb"
                  onValueChange={(value) => handleValueChange(rgbaToHsva(value))}
                />
              )}
              {colorType === 'hsl' && (
                <ObjectColorInput
                  value={hsvaToHsla(colorHsv)}
                  label="hsl"
                  onValueChange={(value) => handleValueChange(hslaToHsva(value))}
                />
              )}
            </div>
          </div>

          {!hideDefaultSwatches && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                {['#000000', '#ffffff', '#f43f5e', '#8b5cf6', '#3b82f6', '#22c55e', '#eab308']
                  .map((color) => (
                    <button
                      key={color}
                      className={cn(
                        'h-6 w-6 rounded-md border border-gray-200',
                        'ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      )}
                      style={{ background: color }}
                      onClick={() => handleValueChange(hexToHsva(color))}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ObjectColorInput({ value, label, onValueChange }: ObjectColorInputProps) {
  return (
    <div className="flex -space-x-px">
      {Object.entries(value)
        .filter(([key]) => key !== 'a')
        .map(([key, val], index) => (
          <Input
            key={key}
            value={Math.round(val)}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              if (!isNaN(newValue)) {
                onValueChange?.({
                  ...value,
                  [key]: newValue,
                });
              }
            }}
            className={cn(
              'bg-white',
              index === 0 && 'rounded-r-none',
              index === 1 && 'rounded-none border-x-0',
              index === 2 && 'rounded-l-none',
            )}
          />
        ))}
    </div>
  );
}

export { ColorPicker };
export type { ColorPickerProps, ColorPickerValue };