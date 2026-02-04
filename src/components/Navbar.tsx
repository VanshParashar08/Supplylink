import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  BarChart2, 
  Package, 
  Home, 
  Bell,
  LogOut
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const { signOut } = useAuth();

  return (
    <div className="bg-white border-b fixed top-0 w-full z-50">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-retail-700">
            <Link to="/">Supply Link</Link>
          </h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <NavButton 
            to="/" 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isActive={path === "/"} 
          />
          <NavButton 
            to="/billing" 
            icon={<ShoppingCart size={20} />} 
            label="Billing" 
            isActive={path === "/billing"} 
          />
          <NavButton 
            to="/inventory" 
            icon={<Package size={20} />} 
            label="Inventory" 
            isActive={path === "/inventory"} 
          />
          <NavButton 
            to="/analytics" 
            icon={<BarChart2 size={20} />} 
            label="Analytics" 
            isActive={path === "/analytics"} 
          />
          <Button variant="ghost" onClick={signOut} className="flex items-center gap-2">
            <LogOut size={20} />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavButton({ to, icon, label, isActive }: NavButtonProps) {
  return (
    <Button asChild variant="ghost" className={cn("flex flex-col h-14 px-4 py-2", isActive && "bg-muted")}>
      <Link to={to}>
        <div className="flex flex-col items-center justify-center space-y-1">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
      </Link>
    </Button>
  );
}
