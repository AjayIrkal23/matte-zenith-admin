import { Search, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSelectedDepartment,
  setSearchQuery,
  selectSelectedDepartment,
  selectUsersSearchQuery,
} from "@/store/slices/usersUiSlice";
import { selectUniqueDepartments } from "@/store/slices/usersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UsersFilters() {
  const dispatch = useAppDispatch();
  const selectedDepartment = useAppSelector(selectSelectedDepartment);
  const searchQuery = useAppSelector(selectUsersSearchQuery);
  const uniqueDepartments = useAppSelector(selectUniqueDepartments);

  const resetFilters = () => {
    dispatch(setSelectedDepartment(undefined));
    dispatch(setSearchQuery(""));
  };

  return (
    <Card className="glass-panel">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="pl-10 bg-hover-overlay/30 border-panel-border focus:border-adani-primary/50"
            />
          </div>

          <Select
            value={selectedDepartment}
            onValueChange={(value) =>
              dispatch(
                setSelectedDepartment(value === "all" ? undefined : value)
              )
            }
          >
            <SelectTrigger className="bg-hover-overlay/30 border-panel-border">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="bg-panel-bg border-panel-border">
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={resetFilters}
            className="btn-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}