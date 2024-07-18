"use client";
import SideBar from "../components/Sidebar/Sidebar";
import WithAuth from "../components/WithAuth/WithAuth";
import { useAppContext } from "../context/AppContext";

function DashboardLayout({ children }) {
  const { isSidebarOpen, toggleSidebar } = useAppContext();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col lg:flex-row">
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <>{children}</>
    </div>
  );
}

export default WithAuth(DashboardLayout);
