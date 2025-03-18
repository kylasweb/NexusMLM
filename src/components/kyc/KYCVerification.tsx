import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { updateUserProfile } from "@/lib/api";
import {
  Check,
  AlertCircle,
  Upload,
  FileText,
  CreditCard,
  User,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

const KYCVerification = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real implementation, you would upload the files to storage
      // and then update the user profile with the document URLs

      // For now, we'll just update the KYC status
      await updateUserProfile(user.id, {
        kyc_verified: true,
      });

      setSuccess(
        "KYC verification submitted successfully! Your documents will be reviewed shortly.",
      );
      // Move to the next tab or show completion
      if (activeTab === "personal") setActiveTab("documents");
      else if (activeTab === "documents") setActiveTab("selfie");
      else if (activeTab === "selfie") setActiveTab("review");
    } catch (err: any) {
      setError(err.message || "Failed to submit KYC verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <p className="text-gray-500">
            Complete your identity verification to unlock all features
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

        <Card>
          <CardHeader>
            <CardTitle>Identity Verification Process</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal" disabled={loading}>
                  <User className="mr-2 h-4 w-4" /> Personal Info
                </TabsTrigger>
                <TabsTrigger value="documents" disabled={loading}>
                  <CreditCard className="mr-2 h-4 w-4" /> ID Documents
                </TabsTrigger>
                <TabsTrigger value="selfie" disabled={loading}>
                  <User className="mr-2 h-4 w-4" /> Selfie Verification
                </TabsTrigger>
                <TabsTrigger value="review" disabled={loading}>
                  <FileText className="mr-2 h-4 w-4" /> Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Legal Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        name="nationality"
                        value={personalInfo.nationality}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={personalInfo.city}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={personalInfo.country}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={personalInfo.postalCode}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Continue to Documents"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Government-Issued ID
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload a clear photo of your passport, driver's license,
                      or national ID card.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {idDocument ? (
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm font-medium">
                            {idDocument.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(idDocument.size / 1024)} KB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setIdDocument(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG, JPG or PDF (max. 5MB)
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,application/pdf"
                            onChange={(e) => handleFileChange(e, setIdDocument)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Proof of Address
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload a utility bill, bank statement, or official letter
                      showing your name and address (issued within the last 3
                      months).
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {addressProof ? (
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm font-medium">
                            {addressProof.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(addressProof.size / 1024)} KB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setAddressProof(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG, JPG or PDF (max. 5MB)
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,application/pdf"
                            onChange={(e) =>
                              handleFileChange(e, setAddressProof)
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("personal")}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !idDocument || !addressProof}
                    >
                      {loading ? "Saving..." : "Continue to Selfie"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="selfie">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Selfie Verification
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload a clear photo of yourself holding your ID document.
                      Make sure your face and the ID are clearly visible.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {selfie ? (
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm font-medium">{selfie.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(selfie.size / 1024)} KB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelfie(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG or JPG (max. 5MB)
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg"
                            onChange={(e) => handleFileChange(e, setSelfie)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("documents")}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !selfie}
                    >
                      {loading ? "Saving..." : "Continue to Review"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="review">
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-green-800">
                        Verification Submitted
                      </h3>
                    </div>
                    <p className="text-green-700 mb-4">
                      Thank you for submitting your KYC verification documents.
                      Our team will review your information and update your
                      verification status within 1-2 business days.
                    </p>
                    <div className="bg-white p-4 rounded-md border border-green-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        What happens next?
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>
                            Our compliance team will review your submitted
                            documents
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>
                            You'll receive an email notification once the
                            verification is complete
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>
                            Once verified, you'll have full access to all
                            platform features
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Button
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KYCVerification;
