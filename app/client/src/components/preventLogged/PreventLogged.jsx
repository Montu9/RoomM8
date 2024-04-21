import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PreventLogged = () => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(typeof auth.accessToken, auth.accessToken);

    return auth?.accessToken === null || auth?.accessToken === "null" || !auth?.accessToken ? (
        <Outlet />
    ) : (
        <Navigate to="/dashboard" state={{ from: location }} replace />
    );
};

export default PreventLogged;
