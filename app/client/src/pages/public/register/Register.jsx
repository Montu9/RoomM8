import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import logo from "./../../../assets/svg/logo.svg";
import { useEffect, useState } from "react";
import axios from "../../../api/axios.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const REGISTER_URL = "/user";

const userSchema = yup
    .object({
        firstname: yup.string().trim().required("Firstname is required"),
        lastname: yup.string().trim().required("Lastname is required"),
        email: yup.string().trim().email("Email must be valid").required("Email is required"),
        passwd: yup.string().trim().required("Password is a required field"),
        cpasswd: yup.string().trim().required("Confirmation password is a required field"),
        gender: yup.mixed().oneOf(["Female", "Male", "Other"], "Choose gender from list"),
    })
    .required();

const Register = () => {
    const {
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
    });
    const navigate = useNavigate();
    const [errForm, setErrForm] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data) => {
        const { firstname, lastname, email, passwd, cpasswd, gender } = data;
        if (passwd !== cpasswd) {
            setError("cpasswd", {
                type: "value",
                message: "Passwords should be the same",
            });
            return;
        }

        try {
            await axios.post(REGISTER_URL, JSON.stringify({ firstname, lastname, email, passwd, gender }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setSuccess(true);
            setErrMsg("");
            navigate("/login", { replace: true });
        } catch (err) {
            setSuccess(false);
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.data?.message) {
                setErrMsg(err.response.data.message);
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Data");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Sign up Failed");
            }
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
        <div className="register">
            <div className="card">
                {success ? (
                    <div className="left">
                        <h1>Registered successfully!</h1>
                        <Link to="../login">Sign in!</Link>
                    </div>
                ) : (
                    <div className="left">
                        <h1>
                            Sign Up<span>.</span>
                        </h1>
                        <h5>Create new account to join our portal!</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <p className={errMsg ? "error-msg" : "offscreen"}>{errMsg}</p>
                            <div className="input-wrapper">
                                <div className="input-container">
                                    <input
                                        {...register("firstname")}
                                        type="text"
                                        placeholder=" "
                                        id="firstname"
                                        name="firstname"
                                    />
                                    <label htmlFor="firstname">First Name</label>
                                </div>
                                <div className="input-container">
                                    <input
                                        {...register("lastname")}
                                        type="text"
                                        placeholder=" "
                                        id="lastname"
                                        name="lastname"
                                    />
                                    <label htmlFor="lastname">Last Name</label>
                                </div>
                            </div>
                            <div className="input-container">
                                <input {...register("email")} type="text" placeholder=" " id="email" name="email" />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-container">
                                <input
                                    {...register("passwd")}
                                    type="password"
                                    placeholder=" "
                                    id="passwd"
                                    name="passwd"
                                />
                                <label htmlFor="passwd">Password</label>
                            </div>
                            <div className="input-container">
                                <input
                                    {...register("cpasswd")}
                                    type="password"
                                    placeholder=" "
                                    id="cpasswd"
                                    name="cpasswd"
                                />
                                <label htmlFor="cpasswd">Confirm Password</label>
                            </div>
                            <div className="input-container">
                                <select {...register("gender")} name="gender" id="gender" defaultValue="Choose gender">
                                    <option value="Choose gender" disabled>
                                        Choose gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {
                                <div className="errHolder">
                                    {errForm.map((error, i) => {
                                        return error;
                                    })}
                                </div>
                            }
                            <input type="submit" value="Sign up" />
                        </form>
                        <p>
                            Already a member?
                            <span>
                                <Link to="../login">Sign in!</Link>
                            </span>
                        </p>
                    </div>
                )}

                <div className="right">
                    <Link className="logo-link" to="/">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
