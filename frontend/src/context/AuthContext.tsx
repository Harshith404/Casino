import { createContext,useContext,useState,useEffect} from "react";
import api from "../api/axios";
type User = {
    username: string;
    balance: number;
    role: string;
};
type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth()
{
    const context = useContext(AuthContext);
    if(!context)
    {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
export function AuthProvider({children}:{
    children: React.ReactNode;
})
{
  const [user,setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchUser()
        {
            const token = localStorage.getItem("token");
            if(!token)
            {
                return;
            }
            try
            {
                const response = await api.get("/me");
                setUser(response.data);
            }
            catch(error)
            {
                setUser(null);
            }
        }
    fetchUser();

}, []);
 return (
        <AuthContext.Provider
    value={{
        user,
        setUser
    }}
>
            {children}
        </AuthContext.Provider>
    );
}