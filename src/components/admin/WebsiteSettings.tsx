import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const WebsiteSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      await fetch("/api/website/settings", {
        method: "PUT",
        body: JSON.stringify({}),
      });

      toast({
        title: "Success",
        description: "Website settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update website settings",
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
          <h1 className="text-2xl font-bold">Website Settings</h1>
          <p className="text-gray-500">Manage website appearance and content</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Website Name</Label>
                  <Input placeholder="Enter website name" defaultValue="Zocial MLM" />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input placeholder="Enter website URL" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input type="email" placeholder="Enter support email" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">
                      Enable to show maintenance page
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add other tab contents */}
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WebsiteSettings;