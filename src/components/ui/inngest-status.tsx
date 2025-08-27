"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InngestSubscriptionState } from "@inngest/realtime/hooks";
import { AlertCircle, Check, Clock, Loader2, RefreshCw, X } from "lucide-react";
import { useMemo } from "react";

interface InngestStatusProps {
  state: InngestSubscriptionState;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

// Get status configuration based on state
const getStatusConfig = (state: InngestSubscriptionState) => {
  switch (state) {
    case InngestSubscriptionState.Active:
      return {
        icon: <Check className="mr-1 h-3 w-3" />,
        text: "Connected",
        dotClass: "bg-green-500 animate-pulse",
        badgeClass:
          "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
        variant: "default" as const,
        showRetry: false,
      };
    case InngestSubscriptionState.Connecting:
      return {
        icon: <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
        text: "Connecting",
        dotClass: "bg-blue-500 animate-pulse",
        badgeClass:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200",
        variant: "secondary" as const,
        showRetry: false,
      };
    case InngestSubscriptionState.Closed:
      return {
        icon: <X className="mr-1 h-3 w-3" />,
        text: "Disconnected",
        dotClass: "bg-gray-400",
        badgeClass:
          "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400",
        variant: "secondary" as const,
        showRetry: true,
      };
    case InngestSubscriptionState.Closing:
      return {
        icon: <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
        text: "Closing",
        dotClass: "bg-orange-500 animate-pulse",
        badgeClass:
          "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200",
        variant: "secondary" as const,
        showRetry: false,
      };
    case InngestSubscriptionState.Error:
      return {
        icon: <AlertCircle className="mr-1 h-3 w-3" />,
        text: "Error",
        dotClass: "bg-red-500 animate-pulse",
        badgeClass:
          "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200",
        variant: "destructive" as const,
        showRetry: true,
      };
    case InngestSubscriptionState.RefreshingToken:
      return {
        icon: <RefreshCw className="mr-1 h-3 w-3 animate-spin" />,
        text: "Refreshing Token",
        dotClass: "bg-yellow-500 animate-pulse",
        badgeClass:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
        variant: "secondary" as const,
        showRetry: false,
      };
    default:
      return {
        icon: <Clock className="mr-1 h-3 w-3" />,
        text: "Unknown",
        dotClass: "bg-gray-400",
        badgeClass:
          "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400",
        variant: "secondary" as const,
        showRetry: true,
      };
  }
};

export function InngestStatus({
  state,
  onRetry = () => window.location.reload(),
  showRetryButton = true,
}: InngestStatusProps) {
  const statusConfig = useMemo(() => getStatusConfig(state), [state]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", statusConfig.dotClass)} />
          <span className="text-sm text-muted-foreground">
            Real-time Status
          </span>
        </div>
        <Badge
          variant={statusConfig.variant}
          className={cn(statusConfig.badgeClass)}
        >
          {statusConfig.icon}
          {statusConfig.text}
        </Badge>
      </div>
      {statusConfig.showRetry && showRetryButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="text-xs"
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
}
