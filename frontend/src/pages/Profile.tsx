import { useAuth } from "../context/AuthContext";

function Profile()
{   const {user} = useAuth();

    if(!user)
    {
        return <h1>Loading...</h1>;
    }
    return (
        <div>
            <h1>Profile</h1>
            <h2>Username: {user.username}</h2>
            <h2>Balance: {user.balance}</h2>
            <h2>Role: {user.role}</h2>
        </div>
    );
}

export default Profile;