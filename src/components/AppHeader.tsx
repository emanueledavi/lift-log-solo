import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Dumbbell, Menu, Settings, User, Bell, Scale, Shield, HelpCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LucideIcon } from "lucide-react";

interface NavigationTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AppHeaderProps {
  user: SupabaseUser;
  onSignOut: () => void;
  tabs: NavigationTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function AppHeader({ user, onSignOut, tabs, activeTab, onTabChange }: AppHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsDrawerOpen(false); // Close the drawer
  };
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between gap-3">
        {/* Logo and branding */}
        <div className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-xl shadow-glow animate-glow-pulse">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              FitTracker Pro 💪
            </h1>
            <p className="text-sm text-muted-foreground font-bold hidden sm:block">
              Your digital gym bestie ✨
            </p>
          </div>
        </div>
        
        {/* User controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-9 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full pulse-success"></div>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs truncate max-w-20">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-bold">
                🏋️ Beast Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/settings/profile')}>
                <User className="h-4 w-4" />
                Profilo Beast 💪
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/settings/general')}>
                <Settings className="h-4 w-4" />
                Impostazioni ⚙️
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/settings/notifications')}>
                <Bell className="h-4 w-4" />
                Notifiche 🔔
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/settings/units')}>
                <Scale className="h-4 w-4" />
                Unità di Misura 📏
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/settings/privacy')}>
                <Shield className="h-4 w-4" />
                Privacy 🛡️
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/help')}>
                <HelpCircle className="h-4 w-4" />
                Aiuto & Support 💬
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={onSignOut}
              >
                <LogOut className="h-4 w-4" />
                Logout Beast! 👋
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Hamburger Menu */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-9 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
              <DrawerHeader className="text-center pb-4">
                <DrawerTitle className="text-2xl font-black gradient-text">
                  🔥 Navigation Beast 🔥
                </DrawerTitle>
              </DrawerHeader>
              
              <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <Button
                        key={tab.id}
                        variant={isActive ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleTabClick(tab.id)}
                        className={`
                          flex flex-col gap-3 h-auto py-6 px-4 text-sm font-bold
                          transition-all duration-300 hover:scale-105
                          ${isActive ? 'shadow-glow-lg animate-glow-pulse' : 'hover:bg-primary/5'}
                        `}
                      >
                        <Icon className={`h-8 w-8 ${isActive ? 'animate-bounce' : ''}`} />
                        <span className="font-black text-center leading-tight">
                          {tab.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}