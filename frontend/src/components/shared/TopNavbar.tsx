import React from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";
import { useWallet } from "../../hooks/useWallet";
import { truncateAddress } from "../../services/mockData";

export const TopNavbar: React.FC = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const { isConnected, address, connectWallet } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 md:px-8 py-3.5 bg-surface/70 dark:bg-inverse-surface/70 backdrop-blur-lg border-b border-white/20 dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-primary p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors"
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined select-none">menu</span>
        </button>
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="font-display-brand text-display-brand text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity active:scale-95 duration-200 text-2.5xl leading-none"
        >
          TaskProof
        </Link>

        {/* Global Links for Desktop */}
        <div className="hidden md:flex gap-6 ml-8">
          <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity">Docs</a>
          <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity">Network</a>
          <a href="#" className="font-body-md text-sm text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity">Stellar Explorer</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Bell and Settings Icon Buttons */}
        <div className="hidden md:flex gap-2">
          <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors" title="Notifications">
            <span className="material-symbols-outlined select-none">notifications</span>
          </button>
          <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors" title="Settings Suggestions">
            <span className="material-symbols-outlined select-none">settings_suggest</span>
          </button>
        </div>

        {/* Connect Wallet / Quick Profile Icon */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <button className="hidden sm:inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full font-label-sm text-label-sm select-none font-semibold">
                {truncateAddress(address || "")}
              </button>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden select-none">
                <img
                  alt="Wallet Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8UBPdBPqomba6R1cfmFKum7te3nKRQlHliq82Rx-_EmyJ-KiFuvSW2DCGduvZJG_KQR4ksPlKgub6Nd7JkxIRdm42Q5rWVv6KrG7XvCQ7gY2upf7IChNcXAJD44nbFserI0hsX2Hz_JuWMQeG3mJmNx6zUhGIcZ3coSVUVpuGNrXpx0Yxob7hsRtMBkTF56LQBUMl5Fzj8deQ_rh5djzCJANZsmPMggCpRDpU7jYYTloCqydOEw69rLXAH2ovWUhyvvr6zI4n2IjE"
                />
              </div>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-sm text-label-sm hover:opacity-90 active:scale-95 transition-all shadow-sm font-semibold"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
