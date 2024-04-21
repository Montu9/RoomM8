import "./missing.scss";
import imgErr from "../../../assets/svg/16.svg";
import { useNavigate } from "react-router-dom";

const Missing = () => {
    const navigate = useNavigate();

    return (
        <div className="missing">
            <img onClick={() => navigate(-1)} src={imgErr} alt="Error 404" />
        </div>
    );
};

export default Missing;
