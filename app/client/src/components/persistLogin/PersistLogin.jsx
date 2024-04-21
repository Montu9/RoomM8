import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return auth.accessToken === null || auth.accessToken === "null" ? (
        <Navigate to="/login" state={{ from: location }} replace />
    ) : (
        <Outlet />
    );
};

export default PersistLogin;
