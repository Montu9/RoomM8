import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "../navbar/Navbar";
import "./requireAuth.scss";
import ProfileFloat from "../profileFloat/ProfileFloat";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return auth?.accessToken ? (
        <div className="app-wrapper">
            <Navbar />
            <div className="app-main">
                <Outlet />
            </div>
            <ProfileFloat />
        </div>
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;
