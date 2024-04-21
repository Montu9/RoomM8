import { createContext, useEffect, useState } from "react";

const INITIAL_STATE = {
    accessToken: localStorage.getItem("accessToken") || null,
    email: localStorage.getItem("email") || null,
};
const INITIAL_STATE_USER = () => {
    let user;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        user = {};
    }
    return user;
};

const AuthContext = createContext(INITIAL_STATE);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(INITIAL_STATE);
    const [user, setUser] = useState(INITIAL_STATE_USER);

    const authClear = () => {
        setAuth({ email: null, accessToken: null });
    };

    useEffect(() => {
        localStorage.setItem("accessToken", auth.accessToken);
        localStorage.setItem("email", auth.email);
    }, [auth]);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return <AuthContext.Provider value={{ auth, setAuth, authClear, user, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
