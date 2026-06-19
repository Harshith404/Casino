import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({
    children,
}: {
    children: React.ReactNode;
})
{
    const [role,setRole] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        async function fetchRole()
        {
            const token = localStorage.getItem("token");
            if(!token)
            {
                setLoading(false);
                return;
            }
            const response = await fetch(
                "https://casino-ubcn.onrender.com/me",
                {
                    method:"GET",
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setRole(data.role);
            setLoading(false);
        }

        fetchRole();
    }, []);

    const token = localStorage.getItem("token");
    if(!token)
    {
        return <Navigate to="/" />;
    }
    if(loading)
    {
        return <h1>Loading...</h1>;
    }
    if(role !== "admin")
    {
        return <Navigate to="/dashboard" />;
    }
    return children;
}

export default AdminRoute;