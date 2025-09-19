import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calculator, 
  Timer,
  Database,
  Trophy,
  Crosshair
} from "lucide-react";

const mainItems = [
  {
    id: "dashboard",
    title: "Centro di Controllo",
    icon: LayoutDashboard,
  },
  {
    id: "workout-log", 
    title: "Diario Allenamenti",
    icon: BookOpen,
  },
  {
    id: "exercises",
    title: "Database Esercizi", 
    icon: Database,
  },
];

const planningItems = [
  {
    id: "workout-plans",
    title: "Le Tue Schede",
    icon: Target,
  },
  {
    id: "goals", 
    title: "I Tuoi Obiettivi",
    icon: Crosshair,
  },
];

const analyticsItems = [
  {
    id: "progress",
    title: "Analisi Progressi",
    icon: TrendingUp,
  },
  {
    id: "achievements",
    title: "Hall of Fame", 
    icon: Trophy,
  },
];

const toolsItems = [
  {
    id: "calories",
    title: "Calc. Calorie",
    icon: Calculator,
  },
  {
    id: "timer",
    title: "Timer Riposo",
    icon: Timer,
  },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { open } = useSidebar();

  const renderMenuItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton 
            onClick={() => onTabChange(item.id)}
            isActive={activeTab === item.id}
            className="w-full justify-start"
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {open && <span>{item.title}</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className={open ? "w-64" : "w-14"}>
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className={open ? "" : "sr-only"}>
            Principale
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? "" : "sr-only"}>
            Pianificazione
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(planningItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? "" : "sr-only"}>
            Analisi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(analyticsItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? "" : "sr-only"}>
            Strumenti
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(toolsItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}