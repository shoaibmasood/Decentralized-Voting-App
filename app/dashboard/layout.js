"use client";
import SideBar from "../components/Sidebar/Sidebar";
import { useAppContext } from "@/app/context/AppContext";
import WithAuth from "../components/WithAuth/WithAuth";

function DashboardLayout({
  children, // will be a page or nested layout
}) {
  const { account } = useAppContext();
  console.log("dashboard", account);
  return (
    <div className="container flex">
      <div className="flex-[2]">
        <SideBar />
      </div>
      <div className="bg-gray-100 flex-[8] p-4 rounded min-h-[300px]  ">
        {children}
      </div>
    </div>
  );
}

export default WithAuth(DashboardLayout);
