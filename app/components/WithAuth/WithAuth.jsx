"use client";
import { useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { redirect } from "next/navigation";
import { ADMIN_ADDRESS } from "../../constants/constants";

function WithAuth(Component) {
  return function withAuth(props) {
    const { address } = useAppContext();

    useEffect(() => {
      console.log(" auth account value ", address);

      if (address?.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
        return redirect("/");
      }
    }, [address]);

    if (address !== ADMIN_ADDRESS.toLowerCase()) {
      return null;
    }
    return <Component {...props} />;
  };
}

export default WithAuth;
