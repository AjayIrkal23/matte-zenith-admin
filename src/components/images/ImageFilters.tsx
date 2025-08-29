import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ImageFiltersProps {
  selectedSeverities: string[];
  onToggleSeverity: (severity: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  severityOptions: string[];
  onReset: () => void;
}

export const ImageFilters: React.FC<ImageFiltersProps> = ({
  selectedSeverities,
  onToggleSeverity,
  dateRange,
  onDateRangeChange,
  severityOptions,
  onReset,
}) => (
  <Card className="glass-panel">
    <CardContent className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          value={selectedSeverities.join(",")}
          onValueChange={() => {}}
        >
          <SelectTrigger className="bg-hover-overlay/30 border-panel-border">
            <SelectValue placeholder="Filter by Severity" />
          </SelectTrigger>
          <SelectContent className="bg-panel-bg border-panel-border">
            {severityOptions.map((severity) => (
              <SelectItem
                key={severity}
                value={severity}
                onClick={() => onToggleSeverity(severity)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      severity === "Critical"
                        ? "bg-red-500"
                        : severity === "High"
                        ? "bg-orange-500"
                        : severity === "Medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  {severity}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal bg-hover-overlay/30 border-panel-border w-full"
            >
              <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {dateRange.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "MMM dd")} - ${format(
                        dateRange.to,
                        "MMM dd"
                      )}`
                    : format(dateRange.from, "MMM dd, y")
                  : "Pick date range"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-panel-bg border-panel-border"
            align="start"
          >
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => onDateRangeChange(range || {})}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div className="lg:col-span-2 flex gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            className="btn-secondary flex-1 sm:flex-none"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ImageFilters;
