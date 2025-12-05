import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  Moon,
  Loader2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage notification preferences',
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Control your data and security',
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
    },
  ];

  return (
    <div className="px-4 py-6 space-y-6 safe-top animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-6 rounded-full bg-secondary">
          <User className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {user?.fullName || user?.username || 'User'}
          </h1>
          <p className="text-muted-foreground">Personal Account</p>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="p-4 rounded-2xl bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">Dark Mode</span>
          </div>
          <Switch defaultChecked disabled />
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 w-full p-4 rounded-2xl bg-card hover:bg-secondary/50 transition-colors"
          >
            <div className="p-2 rounded-xl bg-secondary">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}

        {/* Change Password */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-4 w-full p-4 rounded-2xl bg-card hover:bg-secondary/50 transition-colors">
              <div className="p-2 rounded-xl bg-secondary">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your password
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Change Password</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                className="w-full"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Log Out
      </Button>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        FinTrack v1.0.0
      </p>
    </div>
  );
};

export default Profile;
