import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import logo from "./../../../assets/svg/logo.svg";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const LOGIN_URL = "/auth/login";

const userSchema = yup
    .object({
        email: yup.string().trim().email("Email must be valid").required("Email is required"),
        passwd: yup.string().trim().required("Password is a required"),
    })
    .required();

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
    });

    const { setAuth, setUser } = useAuth();
    const navigate = useNavigate();
    const from = "/dashboard";

    const [isLoading, setIsLoading] = useState(false);
    const [errForm, setErrForm] = useState([]);
    const [errMsg, setErrMsg] = useState("");

    const onSubmit = async (data) => {
        const { email, passwd } = data;
        setIsLoading(true);
        try {
            const res = await axios.post(LOGIN_URL, JSON.stringify({ email, passwd }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (!res?.data?.accessToken || !res?.data?.user) throw new Error();

            const accessToken = res?.data?.accessToken;
            setAuth({ email, accessToken });
            setUser(res?.data?.user);
            setIsLoading(false);
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.data?.message) {
                setErrMsg(err.response.data.message);
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login Failed");
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let resultErrors = [];
        Object.keys(errors).forEach((key, index) => {
            if (errors[key])
                resultErrors.push(
                    <p key={index} className="errForm">
                        <ErrorOutlineIcon />
                        {errors[key].message}
                    </p>
                );
        });

        setErrForm(resultErrors);
    }, [errors]);

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <Link className="logo-link" to="/">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>
                <div className="right">
                    <h1>Sign In</h1>
                    <h5>Welcome back! Please enter your details.</h5>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p className={errMsg ? "error-msg" : "offscreen"}>{errMsg}</p>
                        <div className="input-container">
                            <input {...register("email")} type="email" name="email" id="user-email" placeholder=" " />
                            <label htmlFor="user-email">Email</label>
                        </div>
                        <div className="input-container">
                            <input {...register("passwd")} type="password" name="passwd" id="passwd" placeholder=" " />
                            <label htmlFor="passwd">Password</label>
                        </div>
                        {
                            <div className="errHolder">
                                {errForm.map((error, i) => {
                                    return error;
                                })}
                            </div>
                        }
                        {isLoading ? <CircularProgress /> : <input type="submit" value="Sign in" />}
                    </form>
                    <p>
                        Don't have an account?
                        <span>
                            <Link to="../register">Sign Up!</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
