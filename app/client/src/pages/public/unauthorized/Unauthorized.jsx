import "./unauthorized.scss";
import imgErr from "../../../assets/svg/30.svg";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="unauthorized">
            <img onClick={() => navigate(-1)} src={imgErr} alt="Unauthorized" />
        </div>
    );
};

export default Unauthorized;
