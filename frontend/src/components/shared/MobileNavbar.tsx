import React from "react";
import { Link, useLocation } from "react-router-dom";

export const MobileNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: "home" },
    { path: "/tasks", label: "Tasks", icon: "assignment" },
    { path: "/proof-registry", label: "Registry", icon: "verified" },
    { path: "/activity", label: "Activity", icon: "stream" },
    { path: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-2 pb-safe pt-2 bg-surface/85 dark:bg-inverse-surface/85 backdrop-blur-2xl border-t border-white/20 dark:border-white/10 shadow-lg rounded-t-xl select-none">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 ${
              isActive
                ? "bg-secondary-container text-on-secondary-container px-4 scale-95"
                : "text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className="font-label-sm text-[11px] mt-0.5 font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
