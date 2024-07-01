"use client";
import { useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { redirect } from "next/navigation";
import { ADMIN_ADDRESS } from "../../constants/constants";

function WithAuth(Component) {
  return function withAuth(props) {
    const { account } = useAppContext();

    useEffect(() => {
      console.log(" auth account value ", account);

      if (account?.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
        return redirect("/");
      }
    }, [account]);

    if (account !== ADMIN_ADDRESS.toLowerCase()) {
      return null;
    }
    return <Component {...props} />;
  };
}

export default WithAuth;
