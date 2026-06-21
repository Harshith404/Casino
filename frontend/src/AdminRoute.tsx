import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
function AdminRoute({
    children,
}: {
    children: React.ReactNode;
})
{
    const { user } = useAuth();
     if(!user)
    {
        return <Navigate to="/" />;
    }
    if(user.role !== "admin")
    {
        return <Navigate to="/dashboard" />;
    }
    return children;
}

export default AdminRoute;