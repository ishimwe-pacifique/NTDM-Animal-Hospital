# Super Admin System

This document describes the super admin functionality added to the NTDM Animal Hospital system.

## Overview

The super admin system provides comprehensive control over users, consultations, and system settings. Only users with the "superadmin" role can access these features.

## Features

### 1. User Management
- **View All Users**: See all registered users (farmers, doctors, admins, super admins)
- **Edit Users**: Update user information, roles, and permissions
- **Suspend/Activate Users**: Control user access to the system
- **Delete Users**: Permanently remove user accounts
- **Search & Filter**: Find users by name, email, or role

### 2. Consultation Management
- **View All Consultations**: Monitor all consultation requests
- **Filter by Status**: View pending, approved, rejected, and completed consultations
- **Detailed View**: See complete consultation information including feedback
- **Search**: Find consultations by patient name, service, doctor, or farmer

### 3. System Dashboard
- **Statistics**: View total users, consultations, and system health
- **Quick Actions**: Access to key management functions
- **System Status**: Monitor database and service status

### 4. Settings Management
- **General Settings**: Configure site information
- **User Management**: Set user registration and verification policies
- **Notifications**: Configure email and system alerts
- **Database**: Manage backups and maintenance
- **Email**: Configure SMTP settings

## Access

### Login
Super admins can log in using the standard login form with their super admin credentials.

### Navigation
- **Dashboard**: `/superadmin` - Main dashboard with statistics
- **Users**: `/superadmin/users` - User management interface
- **Consultations**: `/superadmin/consultations` - Consultation management
- **Settings**: `/superadmin/settings` - System configuration

## Security

### Role-Based Access Control
- Only users with "superadmin" role can access super admin routes
- Middleware enforces role-based access restrictions
- Other user roles are redirected away from super admin areas

### User Status Management
- **Active**: Normal user access
- **Suspended**: Temporarily blocked from system access
- **Inactive**: Permanently disabled account

## Database Schema Updates

### User Model
- Added `superadmin` role to existing role types
- Added `status` field for user state management
- Added `permissions` array for super admin capabilities
- Added `lastLoginAt` field for tracking

### New Collections
- No new collections required - uses existing `users` and `consultations` collections

## API Endpoints

### Super Admin Actions (`lib/actions/superadmin.ts`)
- `getAllUsers()` - Fetch all users with details
- `updateUserStatus(userId, status)` - Update user status
- `updateUser(userId, formData)` - Update user information
- `deleteUser(userId)` - Delete user account
- `getAllConsultations()` - Fetch all consultations
- `getSystemStats()` - Get system statistics

## Components

### Layout Components
- `SuperAdminSidebar` - Navigation sidebar for super admin interface
- `SuperAdminLayout` - Main layout wrapper with authentication

### Management Components
- `UsersManagement` - Complete user management interface
- `ConsultationsManagement` - Consultation review and monitoring

### Pages
- `/superadmin` - Dashboard with statistics
- `/superadmin/users` - User management
- `/superadmin/consultations` - Consultation management
- `/superadmin/settings` - System settings

## Usage Instructions

1. **Login as Super Admin**: Use super admin credentials on the login page
2. **Access Dashboard**: View system statistics and health status
3. **Manage Users**: 
   - Go to Users page to view all users
   - Use search to find specific users
   - Click actions menu to edit, suspend, or delete users
4. **Review Consultations**:
   - Go to Consultations page to view all consultations
   - Use tabs to filter by status (pending, approved, rejected, completed)
   - Click view button to see detailed consultation information
5. **Configure Settings**:
   - Go to Settings page to modify system configuration
   - Update general settings, user policies, and email configuration

## Security Considerations

- Super admin accounts should be created carefully and securely
- Regular password updates recommended
- Monitor super admin activity logs
- Consider implementing audit trails for sensitive operations
- Backup user data before performing bulk operations

## Future Enhancements

- Audit logging for super admin actions
- Bulk user operations
- Advanced reporting and analytics
- System health monitoring
- Automated backup scheduling
- User activity tracking
