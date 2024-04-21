import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./userSettings.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useAuth from "../../../hooks/useAuth";

const userSchema = yup
    .object({
        firstname: yup.string().trim(),
        lastname: yup.string().trim(),
        email: yup.string().trim(),
        gender: yup.mixed().oneOf(["Female", "Male", "Other", "Choose gender"], "Choose gender from list"),
    })
    .required();

const passwdSchema = yup
    .object({
        oldPasswd: yup.string().trim().required("Old password is a required"),
        passwd: yup.string().trim().required("Password is a required"),
        cpasswd: yup.string().trim().required("Confirmation password is a required"),
    })
    .required();

const UserSettings = () => {
    const axiosPrivate = useAxiosPrivate();
    const { setUser } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
    });

    const {
        setError,
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
    } = useForm({
        resolver: yupResolver(passwdSchema),
    });
    const [errForm, setErrForm] = useState([]);
    const [errPasswdForm, setErrPasswdForm] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [errMsgPasswd, setErrMsgPasswd] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [successMsgPasswd, setSuccessMsgPasswd] = useState("");

    const onUserSubmit = async (data) => {
        const { firstname, lastname, email, gender } = data;
        setSuccessMsg("");
        setErrMsg("");
        let userData = { firstname, lastname, email, gender };
        for (let key in userData) {
            if (!userData[key] || userData[key].length === 0 || userData[key] === "Choose gender") {
                delete userData[key];
            }
        }
        console.log(userData);
        if (Object.keys(userData).length === 0) return setErrMsg("Enter at least 1 field");
        try {
            const res = await axiosPrivate.patch("/user", JSON.stringify(userData));
            setUser(res?.data?.user);
            setSuccessMsg("User updated successfully!");
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.data?.message) {
                setErrMsg(err.response.data.message);
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Data");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Action Failed");
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

    useEffect(() => {
        let resultErrors = [];
        Object.keys(errors2).forEach((key, index) => {
            if (errors2[key])
                resultErrors.push(
                    <p key={index} className="errForm">
                        <ErrorOutlineIcon />
                        {errors2[key].message}
                    </p>
                );
        });

        setErrPasswdForm(resultErrors);
    }, [errors2]);

    const onPasswdSubmit = async (data) => {
        const { oldPasswd, passwd, cpasswd } = data;
        setErrMsgPasswd("");
        setSuccessMsgPasswd("");
        if (cpasswd !== passwd) {
            setError("cpasswd", {
                type: "value",
                message: "Passwords should be the same",
            });
            return;
        }

        try {
            await axiosPrivate.patch("/user/passwd", JSON.stringify({ oldPasswd, passwd }));
            setSuccessMsgPasswd("Password changed successfully!");
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsgPasswd("No Server Response");
            } else if (err.response?.data?.message) {
                setErrMsgPasswd(err.response.data.message);
            } else if (err.response?.status === 400) {
                setErrMsgPasswd("Missing Data");
            } else if (err.response?.status === 401) {
                setErrMsgPasswd("Unauthorized");
            } else {
                setErrMsgPasswd("Action Failed");
            }
        }
    };

    return (
        <div className="user-settings">
            <div className="app-top">
                <h1>User Settings</h1>
                <LabelImportantOutlinedIcon className="app-top-icon" />
            </div>
            <Container maxWidth="lg" className="app-content">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="tile">
                            <form onSubmit={handleSubmit(onUserSubmit)}>
                                <h1>Change personal informations</h1>
                                <p className={errMsg ? "error-msg" : "offscreen"}>{errMsg}</p>
                                <p className={successMsg ? "success-msg" : "offscreen"}>{successMsg}</p>
                                <div className="input-wrapper">
                                    <div className="input-container">
                                        <input
                                            {...register("firstname")}
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            placeholder=" "
                                        />
                                        <label htmlFor="firstname">First Name</label>
                                    </div>
                                    <div className="input-container">
                                        <input
                                            {...register("lastname")}
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            placeholder=" "
                                        />
                                        <label htmlFor="lastname">Last Name</label>
                                    </div>
                                </div>
                                <div className="input-container">
                                    <input
                                        {...register("email")}
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder=" "
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>

                                <div className="input-container">
                                    <select
                                        {...register("gender")}
                                        name="gender"
                                        id="gender"
                                        defaultValue="Choose gender"
                                    >
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
                                <input type="submit" value="Update profile" />
                            </form>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="tile">
                            <form onSubmit={handleSubmit2(onPasswdSubmit)}>
                                <h1>Change password</h1>
                                <p className={errMsgPasswd ? "error-msg" : "offscreen"}>{errMsgPasswd}</p>
                                <p className={successMsgPasswd ? "success-msg" : "offscreen"}>{successMsgPasswd}</p>
                                <div className="input-container">
                                    <input
                                        {...register2("oldPasswd")}
                                        type="password"
                                        name="oldPasswd"
                                        id="oldPasswd"
                                        placeholder=" "
                                        autoComplete="off"
                                    />
                                    <label htmlFor="oldPasswd">Old Password</label>
                                </div>
                                <div className="input-wrapper">
                                    <div className="input-container">
                                        <input
                                            {...register2("passwd")}
                                            type="password"
                                            name="passwd"
                                            id="passwd"
                                            placeholder=" "
                                        />
                                        <label htmlFor="passwd">Password</label>
                                    </div>
                                    <div className="input-container">
                                        <input
                                            {...register2("cpasswd")}
                                            type="password"
                                            name="cpasswd"
                                            id="cpasswd"
                                            placeholder=" "
                                        />
                                        <label htmlFor="cpasswd">Confirm Password</label>
                                    </div>
                                </div>
                                {
                                    <div className="errHolder">
                                        {errPasswdForm.map((error, i) => {
                                            return error;
                                        })}
                                    </div>
                                }
                                <input type="submit" value="Change Password" />
                            </form>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default UserSettings;
