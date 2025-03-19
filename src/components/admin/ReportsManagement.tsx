import React, { useState } from "react";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Download, RefreshCw, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportsManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const generateReport = async (type: string) => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      await fetch(`/api/reports/${type}`, {
        method: "POST",
        body: JSON.stringify({ dateRange }),
      });

      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports Management</h1>
          <p className="text-gray-500">Generate and manage system reports</p>
        </div>

        <div className="flex items-center gap-4">
          <DatePickerWithRange value={dateRange} onChange={setDateRange} />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="user">User Activity</SelectItem>
              <SelectItem value="matrix">Matrix Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="commission">
          <TabsList>
            <TabsTrigger value="commission">Commission Reports</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            <TabsTrigger value="system">System Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="commission" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => generateReport("commission-summary")}>
                  <FileText className="mr-2 h-4 w-4" /> Generate Summary Report
                </Button>
                <Button onClick={() => generateReport("commission-detailed")}>
                  <FileText className="mr-2 h-4 w-4" /> Generate Detailed Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add other tab contents with similar structure */}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsManagement;

