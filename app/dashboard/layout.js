"use client";
import SideBar from "../components/Sidebar/Sidebar";
import WithAuth from "../components/WithAuth/WithAuth";

function DashboardLayout({
  children, // will be a page or nested layout
}) {
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
