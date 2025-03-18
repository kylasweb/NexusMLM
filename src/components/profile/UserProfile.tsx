import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Check, AlertCircle, User, Shield, CreditCard } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  rank: string;
  status: string;
  kyc_verified: boolean;
  created_at: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const data = await getUserProfile(user.id);
        setUserData(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(user.id, {
        full_name: formData.full_name,
        phone: formData.phone || null,
        address: formData.address || null,
      });

      setSuccess("Profile updated successfully");

      // Update local state
      setUserData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          full_name: formData.full_name,
          phone: formData.phone || null,
          address: formData.address || null,
        };
      });
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={
                      userData?.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id}`
                    }
                  />
                  <AvatarFallback>
                    {userData?.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-xl font-bold mb-1">{userData?.full_name}</h2>
              <p className="text-gray-500 mb-3">{userData?.email}</p>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {userData?.rank} Rank
                </span>
                {userData?.kyc_verified && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                    Verified
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date(userData?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">
                    {userData?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">KYC Status</span>
                  <span className="font-medium">
                    {userData?.kyc_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Upload New Photo
              </Button>
            </CardContent>
          </Card>

          {/* Profile Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" /> Personal Info
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" /> Security
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={userData?.email || ""}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Change Password
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current_password">
                              Current Password
                            </Label>
                            <Input id="current_password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input id="new_password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm_password">
                              Confirm New Password
                            </Label>
                            <Input id="confirm_password" type="password" />
                          </div>
                          <Button>Update Password</Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium mb-2">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Add an extra layer of security to your account by
                          enabling two-factor authentication.
                        </p>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Saved Payment Methods
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-500 mb-4">
                            You don't have any payment methods saved yet.
                          </p>
                          <Button>Add Payment Method</Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium mb-2">
                          Withdrawal Settings
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Configure your preferred withdrawal methods for
                          commission payouts.
                        </p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bank_name">Bank Name</Label>
                            <Input
                              id="bank_name"
                              placeholder="Enter your bank name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account_number">
                              Account Number
                            </Label>
                            <Input
                              id="account_number"
                              placeholder="Enter your account number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="routing_number">
                              Routing Number
                            </Label>
                            <Input
                              id="routing_number"
                              placeholder="Enter your routing number"
                            />
                          </div>
                          <Button>Save Withdrawal Method</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
