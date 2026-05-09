import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Tractor, 
  Egg, 
  Wheat, 
  Skull,
  Syringe,
  Banknote,
  ThermometerSnowflake,
  BookOpen,
  Activity, 
  Wifi, 
  WifiOff, 
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { syncPendingRecords } from '../../lib/db';

const navItems = [
  { name: 'Master Logbook', path: '/', icon: Tractor },
  { name: 'Egg Production', path: '/eggs', icon: Egg },
  { name: 'Feed Consumption', path: '/feed', icon: Wheat },
  { name: 'Mortality & Culling', path: '/mortality', icon: Skull },
  { name: 'Vaccination', path: '/vaccination', icon: Syringe },
  { name: 'Sales', path: '/sales', icon: Banknote },
  { name: 'Incubator', path: '/incubator', icon: ThermometerSnowflake },
  { name: 'Cash Flow', path: '/cashflow', icon: BookOpen },
];

export function AppLayout() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingRecords();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full bg-white text-slate-900 z-20 flex items-center justify-between p-4 shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Legal Chicks</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm h-full z-10 transition-all duration-300 relative">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Legal Chicks</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Farm Dashboard</p>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "text-slate-600 hover:bg-slate-50 border border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "opacity-80")} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors",
            isOnline ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-amber-500")}></div>
            {isOnline ? 'SYSTEM SET: ONLINE' : 'OFFLINE MODE'}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-col bg-white text-slate-900 h-full transform transition-transform">
             <div className="p-6 flex items-center gap-3 border-b border-slate-100 pt-16">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight">Legal Chicks</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Farm Dashboard</p>
              </div>
            </div>
            
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold",
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "text-slate-600 hover:bg-slate-50 border border-transparent"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "opacity-80")} />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors",
                isOnline ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
              )}>
                <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-amber-500")}></div>
                {isOnline ? 'SYSTEM SET: ONLINE' : 'OFFLINE MODE'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-6 animate-in fade-in duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
