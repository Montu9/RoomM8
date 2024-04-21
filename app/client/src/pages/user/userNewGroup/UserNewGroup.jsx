import "./userNewGroup.scss";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import { Grid, Paper } from "@mui/material";
import { Container } from "@mui/system";

const UserNewGroup = () => {
    const errRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [groupName, setGroupName] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        setErrMsg("");
    }, [groupName]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosPrivate.post("/group", JSON.stringify({ name: groupName }));

            const path = "/group/" + res.data?.success;
            navigate(path, { state: { from: location }, replace: true });
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
                setErrMsg("Something gone wrong");
            }

            errRef.current.focus();
        }
    };

    return (
        <div className="user-new-group">
            <div className="app-top">
                <h1>Create New Group</h1>
                <LabelImportantOutlinedIcon className="app-top-icon" />
            </div>
            <Container maxWidth="lg" className="app-content">
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <div className="tile">
                            <h1>Create your own group!</h1>
                            <p>
                                Creating a group for you and your roommates has never been easier! Simply type in the
                                desired name and hit the button!
                            </p>
                            <form onSubmit={handleCreateGroup}>
                                <p ref={errRef} className={errMsg ? "error-msg" : "offscreen"}>
                                    {errMsg}
                                </p>
                                <div className="input-container">
                                    <input
                                        onChange={(e) => setGroupName(e.target.value)}
                                        type="text"
                                        name="groupName"
                                        id="groupName"
                                        placeholder=" "
                                        value={groupName}
                                        required
                                    />
                                    <label htmlFor="groupName">Group Name</label>
                                </div>
                                <input type="submit" value="Create New Group" />
                            </form>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div className="title"></div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default UserNewGroup;
