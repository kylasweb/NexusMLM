import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getDirectReferrals } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Users,
  Search,
  Filter,
  Mail,
  Share2,
  Award,
  TrendingUp,
  UserPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  active: boolean;
  joinDate: string;
  referrals: number;
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!user) return;

      try {
        const data = await getDirectReferrals(user.id);
        setTeamMembers(data);
        setFilteredMembers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.rank.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, teamMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    if (!inviteEmail.trim()) {
      setInviteError("Please enter an email address");
      return;
    }

    // In a real implementation, this would send an invitation email
    // For now, we'll just simulate success
    setInviteSuccess(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");

    // Close dialog after a delay
    setTimeout(() => {
      setInviteDialogOpen(false);
      setInviteSuccess(null);
    }, 2000);
  };

  const toggleMemberExpansion = (memberId: string) => {
    if (expandedMember === memberId) {
      setExpandedMember(null);
    } else {
      setExpandedMember(memberId);
    }
  };

  // Generate mock data for downline members
  const generateMockDownline = (parentId: string) => {
    const count = Math.floor(Math.random() * 3) + 1;
    const downline = [];

    for (let i = 0; i < count; i++) {
      downline.push({
        id: `${parentId}-sub-${i}`,
        name: `Downline Member ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parentId}-sub-${i}`,
        rank: ["Bronze", "Silver"][Math.floor(Math.random() * 2)],
        active: Math.random() > 0.3,
        joinDate: new Date(Date.now() - Math.random() * 10000000000)
          .toISOString()
          .split("T")[0],
        referrals: Math.floor(Math.random() * 3),
      });
    }

    return downline;
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
            <p className="mt-4 text-gray-600">Loading your team data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-500">Manage and grow your network</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Team Size</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {teamMembers.length}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <span>Direct referrals in your network</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Members
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {teamMembers.filter((m) => m.active).length}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <span>Members currently active in your team</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Team Performance
                  </p>
                  <h3 className="text-2xl font-bold mt-1">+12%</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <span>Growth in the last 30 days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="members">
              <Users className="mr-2 h-4 w-4" /> Team Members
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Award className="mr-2 h-4 w-4" /> Performance
            </TabsTrigger>
            <TabsTrigger value="tools">
              <Share2 className="mr-2 h-4 w-4" /> Recruitment Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <CardTitle>Team Members</CardTitle>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search members..."
                        className="pl-10 w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hidden md:flex"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setInviteDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-blue-100 p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    {searchQuery ? (
                      <>
                        <h3 className="text-lg font-semibold mb-2">
                          No Results Found
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          No team members match your search criteria. Try a
                          different search term.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold mb-2">
                          No Team Members Yet
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          You haven't added any team members to your network
                          yet. Start building your team by inviting new members.
                        </p>
                        <Button onClick={() => setInviteDialogOpen(true)}>
                          <UserPlus className="mr-2 h-4 w-4" /> Invite New
                          Members
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex items-center mb-4 md:mb-0">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {member.name}
                              </h4>
                              <div className="flex items-center mt-1">
                                <Badge
                                  className={
                                    member.active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {member.active ? "Active" : "Inactive"}
                                </Badge>
                                <span className="text-xs text-gray-500 ml-2">
                                  Joined {member.joinDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <div className="flex items-center">
                              <Badge
                                variant="outline"
                                className="border-blue-300 text-blue-700"
                              >
                                {member.rank}
                              </Badge>
                              <span className="text-sm text-gray-500 ml-2">
                                {member.referrals} referrals
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-1" /> Message
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2"
                                onClick={() => toggleMemberExpansion(member.id)}
                              >
                                {expandedMember === member.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded view with downline */}
                        {expandedMember === member.id && (
                          <div className="bg-gray-50 p-4 border-t">
                            <h5 className="font-medium text-gray-700 mb-3">
                              Downline Members
                            </h5>
                            <div className="space-y-3 pl-6">
                              {member.referrals > 0 ? (
                                generateMockDownline(member.id).map(
                                  (downlineMember) => (
                                    <div
                                      key={downlineMember.id}
                                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                                    >
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarImage
                                            src={downlineMember.avatar}
                                          />
                                          <AvatarFallback>
                                            {downlineMember.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h6 className="font-medium text-gray-800 text-sm">
                                            {downlineMember.name}
                                          </h6>
                                          <div className="flex items-center">
                                            <Badge
                                              className={
                                                downlineMember.active
                                                  ? "bg-green-100 text-green-800 text-xs"
                                                  : "bg-gray-100 text-gray-800 text-xs"
                                              }
                                            >
                                              {downlineMember.active
                                                ? "Active"
                                                : "Inactive"}
                                            </Badge>
                                            <span className="text-xs text-gray-500 ml-2">
                                              {downlineMember.rank}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        View
                                      </Button>
                                    </div>
                                  ),
                                )
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  This member hasn't referred anyone yet.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">
                      Performance Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">
                          Team Growth
                        </p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">+12%</p>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          vs. previous month
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">
                          Avg. Activity Rate
                        </p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">78%</p>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          vs. 65% last month
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">
                          Retention Rate
                        </p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">92%</p>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          vs. 89% last month
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Performers</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Member
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Referrals
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Team Size
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Performance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {teamMembers.length > 0 ? (
                            [...teamMembers]
                              .sort((a, b) => b.referrals - a.referrals)
                              .slice(0, 5)
                              .map((member, index) => (
                                <tr
                                  key={member.id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-3">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>
                                          {member.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="font-medium text-gray-900">
                                        {member.name}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge
                                      variant="outline"
                                      className="border-blue-300 text-blue-700"
                                    >
                                      {member.rank}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {member.referrals}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {Math.floor(Math.random() * 10) +
                                      member.referrals}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                                        <div
                                          className="bg-green-600 h-2.5 rounded-full"
                                          style={{
                                            width: `${85 - index * 10}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {85 - index * 10}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-6 py-4 text-center text-gray-500"
                              >
                                No team members to display
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">
                      Your Referral Link
                    </h3>
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                      <Input
                        value={`https://mlm-matrix.com/ref/${user?.id?.substring(0, 8)}`}
                        readOnly
                        className="flex-1 bg-white"
                      />
                      <Button>Copy Link</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Share this link with potential team members. You'll earn
                      commissions when they join and invest.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Email Templates
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Ready-to-use email templates to invite new members to
                          your team.
                        </p>
                        <Button className="w-full">
                          <Mail className="mr-2 h-4 w-4" /> Use Templates
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Social Media Kit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Graphics, posts, and content to share on your social
                          media platforms.
                        </p>
                        <Button className="w-full">
                          <Share2 className="mr-2 h-4 w-4" /> Download Kit
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Presentation Deck
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Professional presentation to explain the opportunity
                          to potential recruits.
                        </p>
                        <Button className="w-full">
                          <FileText className="mr-2 h-4 w-4" /> View Deck
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Invite Member Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite New Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team. They'll receive an email
                with instructions.
              </DialogDescription>
            </DialogHeader>

            {inviteError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{inviteError}</AlertDescription>
              </Alert>
            )}

            {inviteSuccess && (
              <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertDescription>{inviteSuccess}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleInvite}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <textarea
                    id="message"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="I'd like to invite you to join my team..."
                  ></textarea>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!!inviteSuccess}>
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
