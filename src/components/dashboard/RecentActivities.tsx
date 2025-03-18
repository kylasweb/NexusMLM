import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  related_user?: {
    full_name: string;
    avatar_url: string;
  };
}

interface RecentActivitiesProps {
  activities: Activity[];
  loading?: boolean;
}

const RecentActivities = ({
  activities = [],
  loading = false,
}: RecentActivitiesProps) => {
  // Mock activities if none provided
  const mockActivities = [
    {
      id: "1",
      type: "referral",
      description: "New referral joined your network",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      related_user: {
        full_name: "Jane Smith",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
    },
    {
      id: "2",
      type: "commission",
      description: "Commission received from investment",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      related_user: {
        full_name: "Robert Johnson",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      },
    },
    {
      id: "3",
      type: "rank",
      description: "Rank upgraded to Silver",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "investment",
      description: "New investment plan activated",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);

      if (diffSec < 60) return `${diffSec} sec ago`;
      if (diffMin < 60) return `${diffMin} min ago`;
      if (diffHour < 24) return `${diffHour} hours ago`;
      if (diffDay === 1) return "Yesterday";
      return `${diffDay} days ago`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown time";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            {activity.related_user ? (
              <AvatarImage
                src={
                  activity.related_user.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.id}`
                }
                alt={activity.related_user.full_name}
              />
            ) : (
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.id}`}
              />
            )}
            <AvatarFallback>
              {activity.related_user
                ? activity.related_user.full_name.charAt(0)
                : "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-gray-500">
              {formatTimeAgo(activity.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;
