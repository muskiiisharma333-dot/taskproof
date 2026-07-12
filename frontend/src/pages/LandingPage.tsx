import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

const LandingPage: React.FC = () => {
  const { isConnected, address, connectWallet } = useWallet();
  const navigate = useNavigate();

  const handleWalletAction = async () => {
    if (isConnected && address) {
      navigate("/dashboard");
    } else {
      const success = await connectWallet();
      if (success) {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md mesh-gradient-bg min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Mesh background effect in style */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, hsla(285,41%,86%,1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(205,100%,88%,1) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(285,41%,86%,1) 0, transparent 50%)
          `,
          backgroundColor: "#f8f9fa"
        }}
      />

      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/60 dark:bg-inverse-surface/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center px-6 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display-brand text-display-brand text-primary dark:text-primary-fixed-dim select-none text-2.5xl font-bold">
              TaskProof
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-on-surface-variant hover:text-primary hover:opacity-80 transition-colors font-body-md text-sm" href="#features">Features</a>
            <a className="text-on-surface-variant hover:text-primary hover:opacity-80 transition-colors font-body-md text-sm" href="#workflow">Workflow</a>
          </div>
          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-on-surface-variant bg-white/40 border border-white/50 px-2.5 py-1 rounded-full select-none">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
              <button 
                onClick={handleWalletAction}
                className="glass-card px-6 py-2 text-primary font-label-sm text-label-sm hover:opacity-80 transition-all active:scale-95 duration-200 font-semibold border border-white/40 shadow-sm"
              >
                Open Dashboard
              </button>
            </div>
          ) : (
            <button 
              onClick={handleWalletAction}
              className="glass-card px-6 py-2 text-primary font-label-sm text-label-sm hover:opacity-80 transition-all active:scale-95 duration-200 font-semibold border border-white/40 shadow-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-8 max-w-container-max mx-auto w-full relative z-10 flex flex-col gap-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center gap-8 py-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-primary-container/20 blur-[100px] rounded-full -z-10"></div>
          <img 
            alt="TaskProof Logo" 
            className="w-32 h-32 rounded-card shadow-bloom object-contain bg-white p-4" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuwFq5n9yneNeuLU5Cy1aYQKiwkoakbqhWI7L15f8VGxlICRXy9K4nAUiExT0ITSCYyFwIsfDjgZXBWm5WRgjDxnjn1FNH64F8zelfaZeqf7ayEwHTRrv_DTqgVxt-hjuPpLypib3evT-rp-g1u3r0aJUnbYm4_ZsU0KEur5Tk7ilrqm722sGmjUpxLES-4_4dlIWE3jw-xgVk1bGtJ8LIeOxuxxJZSqQKx57H6NzM9H16XnUWvrsOEQ-PXTCLQBHAqfXo4nAeFn7R"
          />
          <h1 className="font-decorative-callout text-5xl md:text-6xl text-primary mt-4 select-none leading-normal">
            Productivity, Verified
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Turn your daily tasks into verifiable achievements. A playful, secure workspace built on the Stellar network.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <button 
              onClick={handleWalletAction}
              className="bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container px-8 py-4 rounded-full font-label-sm text-label-sm shadow-bloom hover:opacity-90 active:scale-95 transition-all font-semibold"
            >
              {isConnected && address ? "Open Dashboard" : "Connect Wallet"}
            </button>
            <a 
              href="#workflow" 
              className="glass-card bg-white/50 px-8 py-4 text-primary font-label-sm text-label-sm hover:bg-white/70 active:scale-95 transition-all font-semibold"
            >
              View Demo
            </a>
          </div>
        </section>

        {/* Features Section (Bento Grid) */}
        <section className="flex flex-col gap-12" id="features">
          <div className="text-center">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary select-none font-bold">
              Playful Precision
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Tools designed for joy and accountability.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300 md:col-span-2 bg-white/75 backdrop-blur-md rounded-card border border-white/40">
              <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Verified Tasks</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Every completed task is cryptographically signed, turning your to-do list into an undeniable portfolio of effort.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="glass-card p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300 bg-white/75 backdrop-blur-md rounded-card border border-white/40">
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  insights
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Visual Insights</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Beautiful, intuitive charts that celebrate your momentum and highlight your best days.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="glass-card p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300 bg-white/75 backdrop-blur-md rounded-card border border-white/40">
              <div className="w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  group_work
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Team Sync</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Collaborate with confidence. See who did what, when, without the micromanagement.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="glass-card p-8 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300 md:col-span-2 bg-white/75 backdrop-blur-md rounded-card border border-white/40">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/50 flex items-center justify-center text-on-primary-fixed group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Client Proof</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Generate instant, trustless reports to prove billable hours and completed milestones to clients.
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="flex flex-col gap-12 relative" id="workflow">
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-container to-secondary-container rounded-full hidden md:block opacity-30 z-0"></div>
          <div className="text-center relative z-10">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary select-none font-bold">
              The Flow
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">From idea to immutable proof.</p>
          </div>
          <div className="flex flex-col gap-16 md:gap-24 relative z-10 mt-8">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2 flex justify-end">
                <div className="glass-card p-6 w-full max-w-sm bg-white/75 backdrop-blur-md rounded-card border border-white/40">
                  <span className="inline-block px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-full font-label-sm text-label-sm mb-4 font-bold">
                    Step 01
                  </span>
                  <h4 className="font-headline-md text-headline-md mb-2 font-bold">Capture</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Quickly log tasks with our minimal interface. Less clutter, more doing.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex w-12 h-12 rounded-full bg-white shadow-glass items-center justify-center text-primary font-bold z-10 relative">
                <div className="absolute w-4 h-4 bg-primary-container rounded-full animate-ping opacity-50"></div>
                1
              </div>
              <div className="w-full md:w-1/2 flex justify-start">
                <div 
                  className="bg-cover bg-center w-full max-w-sm h-48 rounded-card shadow-glass border border-white/20" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGFmSIjcN__Vpv6JVxXXb0qgqvyTcnGOS9T8rykrT3PyGAPB3VWMnIwVkA5rQZaGFmNfgOZPbdL47Sm1n7VxkiqB1Bl8lgwOCqZqCpoikBDo-xxSEmlljNfsZqJol3oNuz5ze3TdpgsN-dzQA_xZxdu2n3cciFcU9J88_KWxGfqAlpscfuVRAIMA1les2LX_1GXeYqgjvMk1fW6sgYaBMM95PfvxsorZxjpkRNc0Srzv_HO9P0PdEqnawa5tawjIasnhsrfq_i7tN6')" }}
                />
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2 flex justify-start">
                <div className="glass-card p-6 w-full max-w-sm bg-white/75 backdrop-blur-md rounded-card border border-white/40">
                  <span className="inline-block px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full font-label-sm text-label-sm mb-4 font-bold">
                    Step 02
                  </span>
                  <h4 className="font-headline-md text-headline-md mb-2 font-bold">Execute</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Focus mode engages. Track time softly in the background while you work.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex w-12 h-12 rounded-full bg-white shadow-glass items-center justify-center text-secondary font-bold z-10">
                2
              </div>
              <div className="w-full md:w-1/2 flex justify-end">
                <div 
                  className="bg-cover bg-center w-full max-w-sm h-48 rounded-card shadow-glass border border-white/20" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHgceOuWIxRhWOuJIP4ufsHuHgZJqe8fXMGEarLvdvQBKdq-lXk0TNVrKJmLImbUvnufydIbukoJE31QEND15JgUe9b049zwhWZRgmjaqEZXqVAdjLumEwavpDn8YYArWuQChV9tipWOmmr8-PYU4JHKZr2vcArZxT7hwoQidtG4DjakP7NaBWUvu3R4whBis33LYExB-JLcnTEdqAPr3pYwHhyCxX_mJiCQISUdMCmFUgocv8C-ef_XjQJLVIs3Pgkr3DmQSHlsa4')" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stellar Integration Section */}
        <section className="glass-card p-8 md:p-16 flex flex-col items-center text-center gap-6 relative overflow-hidden bg-white/70 backdrop-blur-md rounded-card border border-white/40 shadow-sm">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/40 blur-[80px] rounded-full z-0"></div>
          <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-primary mb-2 relative z-10 shadow-sm border border-white">
            <span className="material-symbols-outlined text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              link
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary relative z-10 font-bold select-none">
            Proof on Ledger
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl relative z-10">
            We use the Stellar network to turn your completed tasks into immutable records. It’s like a permanent receipt for your hard work, minus the crypto complexity. Fast, green, and completely invisible until you need it.
          </p>
          <div className="flex gap-4 mt-4 relative z-10 flex-wrap justify-center font-bold">
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2 border border-white">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Fast Finality
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2 border border-white">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Eco-Friendly
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2 border border-white">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Verifiable
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low mt-20 relative z-20 border-t border-white/20 select-none">
        <div className="font-display-brand text-headline-md text-primary font-bold">TaskProof</div>
        <div className="text-secondary font-label-sm text-label-sm font-bold">© 2024 TaskProof. Built on Stellar.</div>
        <div className="flex gap-6 font-bold">
          <a className="font-label-sm text-label-sm text-on-surface-variant/70 hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant/70 hover:text-primary transition-colors" href="#">Terms</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant/70 hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
