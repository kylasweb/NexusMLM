import { useState, useEffect } from "react";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Eye } from "lucide-react";

interface KYCRequest {
  id: string;
  userId: string;
  userName: string;
  documentType: string;
  submissionDate: string;
  status: "pending" | "approved" | "rejected";
  documents: {
    front: string;
    back: string;
    selfie: string;
  };
}

const KYCVerification = () => {
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleViewRequest = (request: KYCRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const loadKYCRequests = async () => {
    try {
      const response = await fetch("/api/kyc/requests");
      const data = await response.json();
      
      const transformedData = data.map((request: any) => ({
        ...request,
        status: request.status as "pending" | "approved" | "rejected"
      }));
      
      setRequests(transformedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load KYC requests",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      await fetch(`/api/kyc/${requestId}/status`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));

      toast({
        title: "Success",
        description: `KYC request ${newStatus} successfully`,
      });
      
      // Close the dialog after successful status update
      setIsViewDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadKYCRequests();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <p className="text-gray-500">Manage user verification requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                  <h3 className="text-2xl font-bold mt-2">24</h3>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Add more status cards */}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Verification Requests</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search requests..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Document Type</th>
                  <th className="text-left p-4">Submission Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="p-4">{request.userName}</td>
                    <td className="p-4">{request.documentType}</td>
                    <td className="p-4">{request.submissionDate}</td>
                    <td className="p-4">{request.status}</td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Review KYC Documents</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="grid grid-cols-2 gap-4">
                {/* Document preview components */}
                <div className="col-span-1">
                  <h3 className="font-medium mb-2">Front of ID</h3>
                  <img 
                    src={selectedRequest.documents.front} 
                    alt="ID Front" 
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="col-span-1">
                  <h3 className="font-medium mb-2">Back of ID</h3>
                  <img 
                    src={selectedRequest.documents.back} 
                    alt="ID Back" 
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <h3 className="font-medium mb-2">Selfie with ID</h3>
                  <img 
                    src={selectedRequest.documents.selfie} 
                    alt="Selfie" 
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedRequest.id, "rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedRequest.id, "approved")}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default KYCVerification;



