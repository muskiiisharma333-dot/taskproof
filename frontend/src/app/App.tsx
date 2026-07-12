import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { WalletProvider } from "../contexts/WalletContext";
import { TaskProvider } from "../contexts/TaskContext";
import { EventProvider } from "../contexts/EventContext";
import { ToastProvider } from "../contexts/ToastContext";
import { SidebarProvider } from "../contexts/SidebarContext";
import { router } from "../routes";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <SidebarProvider>
          <EventProvider>
            <TaskProvider>
              <ToastProvider>
                <RouterProvider router={router} />
              </ToastProvider>
            </TaskProvider>
          </EventProvider>
        </SidebarProvider>
      </WalletProvider>
    </ThemeProvider>
  );
};

export default App;
