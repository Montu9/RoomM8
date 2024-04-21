import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { authClear, setUser } = useAuth();

    const logout = async () => {
        authClear();
        setUser({});
        try {
            const response = await axios("/auth/logout", {
                withCredentials: true,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export default useLogout;
