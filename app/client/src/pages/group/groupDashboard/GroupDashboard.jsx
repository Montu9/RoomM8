import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import { useRef, useState } from "react";
import "./groupDashboard.scss";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const GroupDashboard = () => {
    const params = useParams();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [member, setMember] = useState("");
    const [members, setMembers] = useState([]);
    const [role, setRole] = useState("");
    const effectRan = useRef(false);
    const axiosPrivate = useAxiosPrivate();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        setErrMsg("");
        setSuccessMsg("");
    }, [role, member]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        const path = "/group/" + params.id + "/addMember";

        try {
            await axiosPrivate.post(path, JSON.stringify({ id_user: member, role: role.toLocaleLowerCase() }));
            setSuccessMsg("Successfully added new member to group!");
        } catch (err) {
            console.log(err);

            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.data?.message) {
                setErrMsg(err.response.data.message);
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Data");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Something went wrong");
            }
        }
    };

    useEffect(() => {
        if (effectRan.current === false) {
            let isMounted = true;

            const getMembers = async () => {
                const path = "/group/" + params.id;
                try {
                    const res = await axiosPrivate.get(path);
                    isMounted && setUsers(res.data?.groupData);
                    setMembers(res.data?.users);
                } catch (err) {}
            };
            getMembers();

            return () => {
                effectRan.current = true;
            };
        }
    }, []);
    const renderMemberList = () => {
        const temp = users.map((item, index) => (
            <tr key={index}>
                <td>{item._id}</td>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
                <td>{item.gender}</td>
                <td>{item.chargeAll == null ? 0 : item.chargeAll.toFixed(2)}</td>
            </tr>
        ));

        return temp;
    };

    const renderUsersInGroup = () => {
        const temp = members.map((item, index) => (
            <tr key={index}>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
            </tr>
        ));

        return temp;
    };

    return (
        <div className="group-dashboard">
            <div className="app-top">
                <h1>Group Dashboard</h1>
                <LabelImportantOutlinedIcon className="app-top-icon" />
            </div>
            <Container maxWidth="lg" className="app-content">
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item xs={8}>
                        <table className="tile">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Gender</th>
                                    <th>Charge</th>
                                </tr>
                            </thead>
                            <tbody>{renderMemberList()}</tbody>
                        </table>
                    </Grid>
                    <Grid xs={4} item container spacing={2} direction="column">
                        <Grid item xs={4}>
                            <div className="tile">
                                <form onSubmit={handleAddMember}>
                                    <p className={errMsg ? "error-msg" : "offscreen"}>{errMsg}</p>
                                    <p className={successMsg ? "success-msg" : "offscreen"}>{successMsg}</p>
                                    <h1>Add new member (only owner)</h1>
                                    <div className="input-container">
                                        <input
                                            onChange={(e) => setMember(e.target.value)}
                                            type="text"
                                            name="member"
                                            id="member"
                                            placeholder=" "
                                            value={member}
                                            required
                                        />
                                        <label htmlFor="member">Friend ID</label>
                                    </div>
                                    <div className="input-container">
                                        <select
                                            onChange={(e) => setRole(e.target.value)}
                                            name="role"
                                            id="role"
                                            defaultValue="Choose role"
                                        >
                                            <option value="Choose role" disabled>
                                                Choose role
                                            </option>
                                            <option value="Member">Member</option>
                                            <option value="Owner">Owner</option>
                                        </select>
                                    </div>
                                    <input type="submit" value="Add friend" />
                                </form>
                                <div>{}</div>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <table className="tile">
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                    </tr>
                                </thead>
                                <tbody>{renderUsersInGroup()}</tbody>
                            </table>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default GroupDashboard;
