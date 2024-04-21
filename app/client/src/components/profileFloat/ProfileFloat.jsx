import { Tooltip } from "@mui/material";
import "./profileFloat.scss";
import useAuth from "../../hooks/useAuth";
import FaceIcon from "@mui/icons-material/Face";
import Face3Icon from "@mui/icons-material/Face3";

const ProfileFloat = () => {
    const { user } = useAuth();
    return (
        <div className="profile-wrapper">
            <div className="profile-img">
                <Tooltip title="Copy your ID" arrow placement="top">
                    <div
                        onClick={() => {
                            navigator.clipboard.writeText(user?._id);
                        }}
                        className="profile-content"
                    >
                        {user?.gender === "Female" ? (
                            <Face3Icon sx={{ fontSize: 40 }} htmlColor="#fff" />
                        ) : (
                            <FaceIcon sx={{ fontSize: 40 }} htmlColor="#fff" />
                        )}
                    </div>
                </Tooltip>
            </div>
            <div className="profile-info">
                <h3>Welcome, {user?.firstname}</h3>
                <p>You are logged in as {user?.email} account</p>
            </div>
        </div>
    );
};

export default ProfileFloat;
