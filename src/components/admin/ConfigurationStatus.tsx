"use client";

import { useConfig } from "@/contexts/ConfigContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Settings } from "lucide-react";

/**
 * Example component demonstrating how to use configuration values
 * This can be added to the admin dashboard or settings page
 */
export default function ConfigurationStatus() {
  const { configs, loading, error, getNumber, isFeatureEnabled } = useConfig();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-destructive">
            Failed to load configurations: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get configuration values
  const maxImageSize = getNumber("MAX_IMAGE_SIZE_MB", 5);
  const freeAdsPerMonth = getNumber("FREE_ADS_PER_MONTH", 3);

  // Get feature flags
  const emailVerificationEnabled = isFeatureEnabled("EMAIL_VERIFICATION");
  const smsVerificationEnabled = isFeatureEnabled("SMS_VERIFICATION");
  const chatEnabled = isFeatureEnabled("CHAT");
  const notificationsEnabled = isFeatureEnabled("NOTIFICATIONS");

  const features = [
    { name: "Email Verification", enabled: emailVerificationEnabled },
    { name: "SMS Verification", enabled: smsVerificationEnabled },
    { name: "Real-time Chat", enabled: chatEnabled },
    { name: "Push Notifications", enabled: notificationsEnabled },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Application Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="font-semibold mb-3">General Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Maximum Image Upload Size</span>
                <Badge variant="outline">{maxImageSize} MB</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Free Ads Per Month</span>
                <Badge variant="outline">{freeAdsPerMonth} ads</Badge>
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div>
            <h3 className="font-semibold mb-3">Enabled Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="text-sm">{feature.name}</span>
                  {feature.enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Raw Config Display (for debugging) */}
          <div>
            <h3 className="font-semibold mb-3">
              Available Configurations ({Object.keys(configs).length})
            </h3>
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-1">
                {Object.entries(configs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs font-mono"
                  >
                    <span className="font-semibold text-primary">{key}:</span>
                    <span className="text-muted-foreground break-all">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
