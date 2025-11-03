import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen">
      {/* Sidebar Section */}
      <div className="w-64 h-full fixed md:static bg-black text-white">
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 ml-64 md:ml-0 overflow-y-auto bg-black">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
