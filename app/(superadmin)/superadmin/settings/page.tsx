import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Bell,
  Save
} from "lucide-react"

export const dynamic = 'force-dynamic'
export default function SuperAdminSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  defaultValue="NTDM Animal Hospital"
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <Label htmlFor="siteEmail">Site Email</Label>
                <Input
                  id="siteEmail"
                  type="email"
                  defaultValue="admin@ntdm.com"
                  placeholder="Enter site email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                defaultValue="Professional veterinary services for animal health and care"
                placeholder="Enter site description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApproveUsers">Auto-approve new users</Label>
                <p className="text-sm text-gray-500">
                  Automatically approve new user registrations
                </p>
              </div>
              <Switch id="autoApproveUsers" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmailVerification">Require email verification</Label>
                <p className="text-sm text-gray-500">
                  Users must verify their email before accessing the system
                </p>
              </div>
              <Switch id="requireEmailVerification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowUserDeletion">Allow user deletion</Label>
                <p className="text-sm text-gray-500">
                  Allow super admins to permanently delete user accounts
                </p>
              </div>
              <Switch id="allowUserDeletion" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email notifications</Label>
                <p className="text-sm text-gray-500">
                  Send email notifications for important events
                </p>
              </div>
              <Switch id="emailNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="consultationAlerts">Consultation alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified when new consultations are submitted
                </p>
              </div>
              <Switch id="consultationAlerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="userRegistrationAlerts">User registration alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified when new users register
                </p>
              </div>
              <Switch id="userRegistrationAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database & Maintenance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <select
                  id="backupFrequency"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="daily"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <Label htmlFor="retentionPeriod">Data Retention (days)</Label>
                <Input
                  id="retentionPeriod"
                  type="number"
                  defaultValue="365"
                  placeholder="Enter retention period"
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Database Actions</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Create Backup
                </Button>
                <Button variant="outline" size="sm">
                  Optimize Database
                </Button>
                <Button variant="outline" size="sm">
                  Clear Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  defaultValue="smtp.gmail.com"
                  placeholder="Enter SMTP host"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  defaultValue="587"
                  placeholder="Enter SMTP port"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  type="email"
                  placeholder="Enter SMTP username"
                />
              </div>
              <div>
                <Label htmlFor="smtpPass">SMTP Password</Label>
                <Input
                  id="smtpPass"
                  type="password"
                  placeholder="Enter SMTP password"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
                <p className="text-sm text-gray-500">
                  Enable secure connection for email sending
                </p>
              </div>
              <Switch id="smtpSecure" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
