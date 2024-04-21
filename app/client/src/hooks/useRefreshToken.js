import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth, authClear, setUser } = useAuth();

    const refresh = async () => {
        try {
            const res = await axios.get("/auth/refresh", {
                withCredentials: true,
            });
            setAuth((prev) => {
                return { ...prev, accessToken: res.data.accessToken };
            });
            return res.data.accessToken;
        } catch (err) {
            authClear();
            setUser({});
            return "";
        }
    };
    return refresh;
};

export default useRefreshToken;
