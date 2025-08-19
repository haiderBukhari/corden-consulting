import React, { useState, useEffect } from "react";
import Header from "./header";
import SidebarLayout from "./sidebarLayout";
// import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import { useRouter } from "next/router";
// import { UseGetProfile } from "../../hooks/query/getProfile";

export default function Layout({ title, subtitle, children, role }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  // const { data: user, isLoading } = useGetActiveUser();
  // const { data: userProfile } = UseGetProfile();
  const [userRole, setUserRole] = useState('');
  const [isConfigurationApprover, setIsConfigrationApprover] = useState(false);

  useEffect(() => {
    // Get role from localStorage for demo
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    // Set configuration approver based on role for demo
    if (role === 'business_manager' || role === 'hr_manager') {
        setIsConfigrationApprover(true);
      } else {
        setIsConfigrationApprover(false);
      }
  }, []);

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    // For demo, check if role exists in localStorage
    const role = localStorage.getItem("role");

    if (!role) {
      router.push("/");
    }
  }, [router]);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/London", // Default timezone for demo
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(currentTime);

  return (
    <div className="bg-white min-h-screen text-default_text">
      <div className="">
        <Header user={{ name: userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1).replace('_', ' ') : 'Demo User' }} />
        <div className="flex">
          <SidebarLayout
            role={userRole}
            isConfigurationApprover={isConfigurationApprover}
            isOfficeManager={userRole === 'business_manager' || userRole === 'hr_manager'}
            accessFinanceSection={userRole === 'business_manager' || userRole === 'hr_manager'}
            isGratuityEnable={userRole === 'business_manager'}
          />
          <div className=" flex-col w-full lg:pl-64 bg-white ">
            <div className="flex justify-between text-default_text px-6 py-3 items-center">
              <div className="capitalize">
                <h4 className="font-semibold text-lg">{title}</h4>
                <p className="text-sm">{subtitle}</p>
              </div>
              <div className="">
                <h2>
                  {formattedDate}
                  <span className="ml-3">{formattedTime}</span>
                </h2>
              </div>
            </div>
            <div className="bg-white p-2 text-default_text">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
