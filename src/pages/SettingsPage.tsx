import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"
import { Sidebar } from "../components/Sidebar"
import { Settings, Save, Bell, Shield, Globe, Clock } from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"

// Mock system settings
const mockSettings = {
  general: {
    organizationName: "Acme Corporation",
    organizationLogo: "/placeholder.svg?height=60&width=200",
    supportEmail: "support@acme.com",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "en",
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    slackIntegration: true,
    webhookUrl: "https://hooks.slack.com/services/...",
    notifyOnNewQuery: true,
    notifyOnStatusChange: true,
    notifyOnOverdue: true,
    dailyDigest: true,
  },
  security: {
    requireTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeout: 480, // minutes
    maxLoginAttempts: 5,
    allowGuestAccess: false,
  },
  sla: {
    defaultSlaHours: 24,
    businessHoursStart: "09:00",
    businessHoursEnd: "17:00",
    businessDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    escalationEnabled: true,
    escalationHours: 48,
  },
  integrations: {
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@acme.com",
    smtpPassword: "••••••••",
    ldapEnabled: false,
    ldapServer: "",
    ssoEnabled: false,
    ssoProvider: "",
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial API fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "sla", label: "SLA & Business Hours", icon: Clock },
    { id: "integrations", label: "Integrations", icon: Globe },
  ]

  if (isLoading || isSaving) {
    return <FullScreenLoader message={isSaving ? "Saving..." : undefined} />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system-wide settings and preferences</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                  <CardDescription>Basic information about your organization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={settings.general.organizationName}
                      onChange={(e) => handleSettingChange("general", "organizationName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleSettingChange("general", "supportEmail", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={settings.general.timezone}
                        onValueChange={(value) => handleSettingChange("general", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select
                        value={settings.general.dateFormat}
                        onValueChange={(value) => handleSettingChange("general", "dateFormat", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) => handleSettingChange("general", "language", value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when notifications are sent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "emailNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "smsNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Slack Integration</Label>
                        <p className="text-sm text-gray-500">Send notifications to Slack</p>
                      </div>
                      <Switch
                        checked={settings.notifications.slackIntegration}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "slackIntegration", checked)}
                      />
                    </div>

                    {settings.notifications.slackIntegration && (
                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Slack Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          value={settings.notifications.webhookUrl}
                          onChange={(e) => handleSettingChange("notifications", "webhookUrl", e.target.value)}
                          placeholder="https://hooks.slack.com/services/..."
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Triggers</h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Query Submitted</Label>
                        <p className="text-sm text-gray-500">Notify when a new query is submitted</p>
                      </div>
                      <Switch
                        checked={settings.notifications.notifyOnNewQuery}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "notifyOnNewQuery", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Status Changes</Label>
                        <p className="text-sm text-gray-500">Notify when query status changes</p>
                      </div>
                      <Switch
                        checked={settings.notifications.notifyOnStatusChange}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "notifyOnStatusChange", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Overdue Queries</Label>
                        <p className="text-sm text-gray-500">Notify when queries become overdue</p>
                      </div>
                      <Switch
                        checked={settings.notifications.notifyOnOverdue}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "notifyOnOverdue", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Digest</Label>
                        <p className="text-sm text-gray-500">Send daily summary of query activity</p>
                      </div>
                      <Switch
                        checked={settings.notifications.dailyDigest}
                        onCheckedChange={(checked) => handleSettingChange("notifications", "dailyDigest", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security policies and authentication requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all users</p>
                    </div>
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onCheckedChange={(checked) => handleSettingChange("security", "requireTwoFactor", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Password Policy</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minLength">Minimum Password Length</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={settings.security.passwordMinLength}
                          onChange={(e) =>
                            handleSettingChange("security", "passwordMinLength", Number.parseInt(e.target.value))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                        <Input
                          id="maxAttempts"
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) =>
                            handleSettingChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Special Characters</Label>
                        <p className="text-sm text-gray-500">Passwords must contain special characters</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequireSpecialChars}
                        onCheckedChange={(checked) =>
                          handleSettingChange("security", "passwordRequireSpecialChars", checked)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))
                        }
                      />
                      <p className="text-sm text-gray-500">Users will be logged out after this period of inactivity</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Guest Access</Label>
                        <p className="text-sm text-gray-500">Allow users to submit queries without registration</p>
                      </div>
                      <Switch
                        checked={settings.security.allowGuestAccess}
                        onCheckedChange={(checked) => handleSettingChange("security", "allowGuestAccess", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "sla" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SLA & Business Hours</CardTitle>
                  <CardDescription>Configure service level agreements and business hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultSla">Default SLA (hours)</Label>
                    <Input
                      id="defaultSla"
                      type="number"
                      value={settings.sla.defaultSlaHours}
                      onChange={(e) => handleSettingChange("sla", "defaultSlaHours", Number.parseInt(e.target.value))}
                    />
                    <p className="text-sm text-gray-500">Default response time for new queries</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Business Hours</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={settings.sla.businessHoursStart}
                          onChange={(e) => handleSettingChange("sla", "businessHoursStart", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={settings.sla.businessHoursEnd}
                          onChange={(e) => handleSettingChange("sla", "businessHoursEnd", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Business Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                          <Badge
                            key={day}
                            variant={settings.sla.businessDays.includes(day) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              const newDays = settings.sla.businessDays.includes(day)
                                ? settings.sla.businessDays.filter((d) => d !== day)
                                : [...settings.sla.businessDays, day]
                              handleSettingChange("sla", "businessDays", newDays)
                            }}
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Escalation</Label>
                        <p className="text-sm text-gray-500">Automatically escalate overdue queries</p>
                      </div>
                      <Switch
                        checked={settings.sla.escalationEnabled}
                        onCheckedChange={(checked) => handleSettingChange("sla", "escalationEnabled", checked)}
                      />
                    </div>

                    {settings.sla.escalationEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="escalationHours">Escalation Time (hours)</Label>
                        <Input
                          id="escalationHours"
                          type="number"
                          value={settings.sla.escalationHours}
                          onChange={(e) =>
                            handleSettingChange("sla", "escalationHours", Number.parseInt(e.target.value))
                          }
                        />
                        <p className="text-sm text-gray-500">Escalate queries after this many hours</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>Configure email settings for notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Provider</Label>
                    <Select
                      value={settings.integrations.emailProvider}
                      onValueChange={(value) => handleSettingChange("integrations", "emailProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.integrations.emailProvider === "smtp" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">SMTP Host</Label>
                          <Input
                            id="smtpHost"
                            value={settings.integrations.smtpHost}
                            onChange={(e) => handleSettingChange("integrations", "smtpHost", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input
                            id="smtpPort"
                            type="number"
                            value={settings.integrations.smtpPort}
                            onChange={(e) =>
                              handleSettingChange("integrations", "smtpPort", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                        <Input
                          id="smtpUsername"
                          value={settings.integrations.smtpUsername}
                          onChange={(e) => handleSettingChange("integrations", "smtpUsername", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={settings.integrations.smtpPassword}
                          onChange={(e) => handleSettingChange("integrations", "smtpPassword", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication Integration</CardTitle>
                  <CardDescription>Configure external authentication providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>LDAP Authentication</Label>
                      <p className="text-sm text-gray-500">Enable LDAP/Active Directory authentication</p>
                    </div>
                    <Switch
                      checked={settings.integrations.ldapEnabled}
                      onCheckedChange={(checked) => handleSettingChange("integrations", "ldapEnabled", checked)}
                    />
                  </div>

                  {settings.integrations.ldapEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="ldapServer">LDAP Server</Label>
                      <Input
                        id="ldapServer"
                        value={settings.integrations.ldapServer}
                        onChange={(e) => handleSettingChange("integrations", "ldapServer", e.target.value)}
                        placeholder="ldap://your-domain.com"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Single Sign-On (SSO)</Label>
                      <p className="text-sm text-gray-500">Enable SSO authentication</p>
                    </div>
                    <Switch
                      checked={settings.integrations.ssoEnabled}
                      onCheckedChange={(checked) => handleSettingChange("integrations", "ssoEnabled", checked)}
                    />
                  </div>

                  {settings.integrations.ssoEnabled && (
                    <div className="space-y-2">
                      <Label>SSO Provider</Label>
                      <Select
                        value={settings.integrations.ssoProvider}
                        onValueChange={(value) => handleSettingChange("integrations", "ssoProvider", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SSO provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="okta">Okta</SelectItem>
                          <SelectItem value="azure">Azure AD</SelectItem>
                          <SelectItem value="google">Google Workspace</SelectItem>
                          <SelectItem value="saml">Generic SAML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Save Changes Banner */}
          {hasChanges && (
            <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium">You have unsaved changes</p>
                  <p className="text-sm text-blue-100">Don't forget to save your settings</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} variant="secondary" size="sm">
                  {isSaving ? "Saving..." : "Save Now"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
