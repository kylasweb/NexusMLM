import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Search,
  Download,
  RefreshCw,
  ArrowUpDown,
  DollarSign,
} from "lucide-react";
import { DateRange } from "react-day-picker";

interface Transaction {
  id: string;
  user_id: string;
  type: "deposit" | "withdrawal" | "commission" | "investment";
  amount: number;
  status: "completed" | "pending" | "failed";
  created_at: string;
  payment_method: string;
  description?: string;
}

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [transactionType, setTransactionType] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, [dateRange, transactionType]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          dateRange,
          type: transactionType,
          search: searchQuery,
        }),
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = async () => {
    try {
      // Implement export logic here
      toast({
        title: "Success",
        description: "Transactions exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export transactions",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
    );
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <DatePickerWithRange
                value={dateRange}
                onChange={setDateRange}
              />
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="commission">Commissions</SelectItem>
                  <SelectItem value="investment">Investments</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadTransactions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportTransactions}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Amount
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.user_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {transaction.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




