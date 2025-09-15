# Super Admin Setup Instructions

## How to Access the Super Admin Panel

There are **two ways** to create and access the super admin account:

### Method 1: Using the Registration Form (Recommended)

1. **Go to the registration page**: Navigate to `http://localhost:3000/register`
2. **Fill out the form** with the following details:
   - **Name**: Super Administrator (or your preferred name)
   - **Email**: admin@ntdm.com (or your preferred email)
   - **Password**: Choose a secure password
   - **Phone**: +250 123 456 789 (or your phone number)
   - **Account Type**: Select "Super Administrator"
3. **Submit the form** - this will create your super admin account
4. **Login**: Go to `http://localhost:3000/login` and use your super admin credentials
5. **Access the panel**: You'll be automatically redirected to `/superadmin`

### Method 2: Using the Database Script

1. **Run the script**:
   ```bash
   node scripts/create-superadmin.js
   ```
2. **Use the default credentials**:
   - **Email**: admin@ntdm.com
   - **Password**: admin123
3. **Login**: Go to `http://localhost:3000/login`
4. **Change password**: Update the password after first login

## Default Super Admin Credentials (Method 2)

If you used the database script, the default credentials are:

- **Email**: `admin@ntdm.com`
- **Password**: `admin123`

⚠️ **Important**: Change the password immediately after first login for security!

## Accessing the Super Admin Panel

Once logged in with super admin credentials, you'll have access to:

- **Dashboard**: `/superadmin` - System overview and statistics
- **Users**: `/superadmin/users` - Manage all users (view, edit, suspend, delete)
- **Consultations**: `/superadmin/consultations` - Review all consultations
- **Settings**: `/superadmin/settings` - Configure system settings

## Features Available

### User Management
- View all registered users (farmers, doctors, admins, super admins)
- Edit user information and roles
- Suspend or activate user accounts
- Delete user accounts
- Search and filter users

### Consultation Management
- View all consultation requests
- Filter by status (pending, approved, rejected, completed)
- View detailed consultation information
- Monitor consultation feedback

### System Dashboard
- View system statistics
- Monitor user counts and consultation counts
- Check system health status

### Settings
- Configure general system settings
- Manage user registration policies
- Set up notifications
- Configure email settings
- Database maintenance options

## Security Notes

- Only users with "superadmin" role can access these features
- The system uses role-based access control
- Super admin routes are protected by middleware
- Other user roles are automatically redirected away from super admin areas

## Troubleshooting

If you can't access the super admin panel:

1. **Check your role**: Ensure your account has "superadmin" role in the database
2. **Check your status**: Ensure your account status is "active"
3. **Clear cookies**: Clear browser cookies and try logging in again
4. **Check database connection**: Ensure MongoDB is running and accessible

## Next Steps

After setting up your super admin account:

1. **Change the default password** (if using Method 2)
2. **Review system settings** in the Settings page
3. **Check existing users** in the Users page
4. **Monitor consultations** in the Consultations page
5. **Configure notifications** and other system preferences
