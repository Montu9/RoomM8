import "./navbar.scss";
import logo from "../../assets/svg/logoInv.svg";
import useLogout from "../../hooks/useLogout";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoupeOutlinedIcon from "@mui/icons-material/LoupeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const userNavData = [
    { title: "Dashboard", link: "dashboard", icon: DashboardOutlinedIcon },
    { title: "Create\u00A0Group", link: "create-group", icon: AddCircleOutlineOutlinedIcon },
    { title: "Settings", link: "settings", icon: SettingsOutlinedIcon },
];

const groupNavData = [
    { title: "Dashboard", link: "/", icon: DashboardOutlinedIcon },
    { title: "Add\u00A0Transaction", link: "/add-transaction", icon: LoupeOutlinedIcon },
];

const Navbar = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate("/");
    };

    const renderGroupNav = (data) => {
        const temp = data.map((item, index) => (
            <div key={index} className="menu-item">
                <NavLink to={"group/" + id + item.link} className="menu-icon-link">
                    {<item.icon className="menu-icon" />}
                </NavLink>
                <div className="menu-label">{item.title}</div>
            </div>
        ));
        return temp;
    };

    const renderUserNav = (data) => {
        const temp = data.map((item, index) => (
            <div key={index} className="menu-item">
                <NavLink to={item.link} className="menu-icon-link">
                    {<item.icon className="menu-icon" />}
                </NavLink>
                <div className="menu-label">{item.title}</div>
            </div>
        ));
        return temp;
    };

    return (
        <div className="navbar">
            <div className="navbar-top">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            <div className="navbar-mid">
                {location.pathname.includes("/group/") ? (
                    <>
                        <div className="menu-item">
                            <NavLink to="/dashboard" className="menu-icon-link">
                                <UndoRoundedIcon />
                            </NavLink>
                            <div className="menu-label">Go&nbsp;back</div>
                        </div>
                        {renderGroupNav(groupNavData)}
                    </>
                ) : (
                    renderUserNav(userNavData)
                )}
            </div>

            <div className="navbar-bottom">
                <div className="menu-item">
                    <div className="menu-icon-link">
                        <LogoutOutlinedIcon onClick={signOut} className="menu-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
