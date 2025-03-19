import React, { useState } from "react";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Mail, MessageSquare, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendNotification = async (type: string) => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      await fetch("/api/notifications/send", {
        method: "POST",
        body: JSON.stringify({ type }),
      });

      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
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
          <h1 className="text-2xl font-bold">Notification Management</h1>
          <p className="text-gray-500">Manage system notifications and alerts</p>
        </div>

        <Tabs defaultValue="compose">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send New Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Notification Title</Label>
                  <Input placeholder="Enter notification title" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Enter notification message" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="email" />
                    <Label htmlFor="email">Send Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="push" />
                    <Label htmlFor="push">Send Push Notification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sms" />
                    <Label htmlFor="sms">Send SMS</Label>
                  </div>
                </div>
                <Button onClick={() => sendNotification("all")}>
                  <Send className="mr-2 h-4 w-4" /> Send Notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add other tab contents */}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default NotificationManagement;