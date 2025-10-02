"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Eye,
  Key,
  Wifi,
  WifiOff,
  LogOut,
  Filter,
  Grid3X3,
  List,
  Plus
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateUserStatus, updateUser, deleteUser, updateUserPassword, } from "@/lib/actions/superadmin"
import { forceLogoutUser } from "@/lib/actions"
import { registerUser } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string | null
  isOnline?: boolean
  district?: string | null
  sector?: string | null
  licenseNumber?: string | null
  specialization?: string | null
}

interface UsersManagementProps {
  users: User[]
}

export default function UsersManagement({ users }: UsersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [createUserData, setCreateUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer" as "farmer" | "doctor" | "admin" | "superadmin",
    licenseNumber: "",
    specialization: "",
    district: "",
    sector: ""
  })
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleStatusUpdate = async (userId: string, status: "active" | "suspended" | "inactive") => {
    setIsUpdating(true)
    try {
      const result = await updateUserStatus(userId, status)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating user status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setIsUpdating(true)
    try {
      const result = await deleteUser(userId)
      if (result.success) {
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (userId: string, password: string) => {
    setIsUpdating(true)
    try {
      const result = await updateUserPassword(userId, password)
      if (result.success) {
        setIsPasswordDialogOpen(false)
        setNewPassword("")
        setSelectedUser(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating password:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogoutUser = async (userId: string) => {
    setIsUpdating(true)
    try {
      const result = await forceLogoutUser(userId)
      if (result.success) {
        setIsLogoutDialogOpen(false)
        setSelectedUser(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error logging out user:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const formData = new FormData()
      formData.append("name", createUserData.name)
      formData.append("email", createUserData.email)
      formData.append("password", createUserData.password)
      formData.append("phone", createUserData.phone)
      formData.append("role", createUserData.role)
      
      if (createUserData.role === "doctor") {
        formData.append("licenseNumber", createUserData.licenseNumber)
        formData.append("specialization", createUserData.specialization)
      } else if (createUserData.role === "farmer") {
        formData.append("district", createUserData.district)
        formData.append("sector", createUserData.sector)
      }

      const result = await registerUser(formData)
      if (result.success) {
        setIsCreateDialogOpen(false)
        setCreateUserData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "farmer",
          licenseNumber: "",
          specialization: "",
          district: "",
          sector: ""
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "doctor":
        return "bg-green-100 text-green-800"
      case "farmer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get unique roles and statuses for filters
  const roles = [...new Set(users.map(user => user.role))]
  const statuses = [...new Set(users.map(user => user.status))]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold">{filteredUsers.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {filteredUsers.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {filteredUsers.filter(u => u.isOnline).length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Online</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {filteredUsers.filter(u => u.status === 'suspended').length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">Users Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="hidden sm:flex"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="hidden sm:flex"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters - Stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid View - Mobile always, Desktop when selected */}
      <div className={`${viewMode === 'grid' ? 'block' : 'hidden lg:hidden'}`}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="p-4">
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsPasswordDialogOpen(true)
                        }}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                      </DropdownMenuItem>
                      {user.isOnline && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setIsLogoutDialogOpen(true)
                          }}
                          className="text-orange-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Force Logout
                        </DropdownMenuItem>
                      )}
                      {user.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(user._id, "suspended")}
                          disabled={isUpdating}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(user._id, "active")}
                          disabled={isUpdating}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Badges and Status */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={getRoleColor(user.role)} variant="secondary">
                    {user.role}
                  </Badge>
                  <Badge className={getStatusColor(user.status)} variant="secondary">
                    {user.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {user.isOnline ? (
                      <>
                        <Wifi className="h-3 w-3 text-green-500" />
                        <span className="text-green-600 text-xs">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500 text-xs">Offline</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Joined:</span><br />
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">Last Login:</span><br />
                    {user.lastLoginAt 
                      ? format(new Date(user.lastLoginAt), "MMM dd, yyyy")
                      : "Never"
                    }
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Table View - Desktop only when selected */}
      <Card className={`${viewMode === 'table' ? 'hidden lg:block' : 'hidden'}`}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">User</TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Online</TableHead>
                    <TableHead className="min-w-[120px]">Created</TableHead>
                    <TableHead className="min-w-[160px]">Last Login</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.isOnline ? (
                            <>
                              <Wifi className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 text-sm">Online</span>
                            </>
                          ) : (
                            <>
                              <WifiOff className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500 text-sm">Offline</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {user.lastLoginAt 
                          ? format(new Date(user.lastLoginAt), "MMM dd, yyyy 'at' h:mm a")
                          : "Never"
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setIsPasswordDialogOpen(true)
                              }}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              Change Password
                            </DropdownMenuItem>
                            {user.isOnline && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsLogoutDialogOpen(true)
                                }}
                                className="text-orange-600"
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                Force Logout
                              </DropdownMenuItem>
                            )}
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(user._id, "suspended")}
                                disabled={isUpdating}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(user._id, "active")}
                                disabled={isUpdating}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      {/* Edit User Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form
              action={async (formData: FormData) => {
                const result = await updateUser(selectedUser._id, formData)
                if (result.success) {
                  setIsEditDialogOpen(false)
                  setSelectedUser(null)
                  router.refresh()
                }
              }}
              className="space-y-4"
            >
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedUser.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={selectedUser.email}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={selectedUser.phone}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedUser.role === "farmer" && (
                  <>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        name="district"
                        defaultValue={selectedUser.district || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        id="sector"
                        name="sector"
                        defaultValue={selectedUser.sector || ""}
                      />
                    </div>
                  </>
                )}
                {selectedUser.role === "doctor" && (
                  <>
                    <div>
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        defaultValue={selectedUser.licenseNumber || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        defaultValue={selectedUser.specialization || ""}
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
                  {isUpdating ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-full max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Role:</strong> {selectedUser.role}
              </p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleDeleteUser(selectedUser._id)}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog - Responsive */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="w-full max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>User:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(false)
                setNewPassword("")
                setSelectedUser(null)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handlePasswordChange(selectedUser._id, newPassword)}
              disabled={isUpdating || !newPassword.trim()}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Logout Dialog - Responsive */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="w-full max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Force Logout User</DialogTitle>
            <DialogDescription>
              Are you sure you want to force logout this user? They will be immediately disconnected from all their active sessions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-green-600 text-sm font-medium">Currently Online</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                {selectedUser.lastLoginAt && (
                  <p className="text-sm text-gray-600">
                    <strong>Last Login:</strong> {format(new Date(selectedUser.lastLoginAt), "MMM dd, yyyy 'at' h:mm a")}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsLogoutDialogOpen(false)
                setSelectedUser(null)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleLogoutUser(selectedUser._id)}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Logging out..." : "Force Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system with their role and information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="create-name">Full Name</Label>
                <Input
                  id="create-name"
                  value={createUserData.name}
                  onChange={(e) => setCreateUserData({...createUserData, name: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData({...createUserData, email: e.target.value})}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-password">Password</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData({...createUserData, password: e.target.value})}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <Label htmlFor="create-phone">Phone Number</Label>
                <Input
                  id="create-phone"
                  value={createUserData.phone}
                  onChange={(e) => setCreateUserData({...createUserData, phone: e.target.value})}
                  placeholder="+250 78 123 4567"
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <RadioGroup
                  value={createUserData.role}
                  onValueChange={(value) => setCreateUserData({...createUserData, role: value as any})}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="farmer" id="create-farmer" />
                    <Label htmlFor="create-farmer">Farmer/Pet Owner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="create-doctor" />
                    <Label htmlFor="create-doctor">Veterinarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="create-admin" />
                    <Label htmlFor="create-admin">Administrator</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="superadmin" id="create-superadmin" />
                    <Label htmlFor="create-superadmin">Super Administrator</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {createUserData.role === "doctor" && (
                <>
                  <div>
                    <Label htmlFor="create-license">License Number</Label>
                    <Input
                      id="create-license"
                      value={createUserData.licenseNumber}
                      onChange={(e) => setCreateUserData({...createUserData, licenseNumber: e.target.value})}
                      placeholder="VET-12345"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-specialization">Specialization</Label>
                    <Input
                      id="create-specialization"
                      value={createUserData.specialization}
                      onChange={(e) => setCreateUserData({...createUserData, specialization: e.target.value})}
                      placeholder="e.g., Large Animal Medicine"
                      required
                    />
                  </div>
                </>
              )}
              
              {createUserData.role === "farmer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-district">District</Label>
                    <Input
                      id="create-district"
                      value={createUserData.district}
                      onChange={(e) => setCreateUserData({...createUserData, district: e.target.value})}
                      placeholder="e.g., Kigali"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-sector">Sector</Label>
                    <Input
                      id="create-sector"
                      value={createUserData.sector}
                      onChange={(e) => setCreateUserData({...createUserData, sector: e.target.value})}
                      placeholder="e.g., Nyarugenge"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setCreateUserData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    role: "farmer",
                    licenseNumber: "",
                    specialization: "",
                    district: "",
                    sector: ""
                  })
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
                {isUpdating ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}