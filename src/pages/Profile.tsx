import { Link, Outlet, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Heart, Settings } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const ProfileLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/profile', icon: User, label: 'My Profile', exact: true },
    { path: '/profile/orders', icon: Package, label: 'My Orders' },
    { path: '/profile/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/profile/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <Card className="lg:col-span-1 p-4 h-fit">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path, item.exact) ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </Card>

            {/* Content */}
            <div className="lg:col-span-3">
              <Outlet />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ProfileLayout;
