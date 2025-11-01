import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";



const AuthLayout = ({children}:{children:React.ReactNode})=>{
    return(
        <main className="flex justify-center items-center h-screen flex-col bg-black">
        <Sidebar/>
        {children}
        </main>
    )
}

export default AuthLayout