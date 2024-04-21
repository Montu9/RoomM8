import logo from "./../../../assets/svg/logoInv.svg";
import "./home.scss";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home">
            <div className="card">
                <div className="left">
                    <div className="home-top">
                        <img src={logo} alt="Logo Roomate" />
                        <h1>
                            R<span>oo</span>mMate!
                        </h1>
                    </div>

                    <div className="home-mid">
                        <div className="home-content">
                            <Link to="/login">
                                <h3>Sign in</h3>
                            </Link>
                            <Link to="/register">
                                <h3>Create New Account</h3>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="right"></div>
            </div>
        </div>
    );
};

export default Home;
