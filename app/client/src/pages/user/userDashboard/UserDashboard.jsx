import { Link, useLocation, useNavigate } from "react-router-dom";
import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import "./userDashboard.scss";
import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";

const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const effectRan = useRef(false);

    const [groups, setGroups] = useState([{}]);

    useEffect(() => {
        if (effectRan.current === false) {
            let isMounted = true;

            const getGroups = async () => {
                try {
                    const res = await axiosPrivate.get("/user/groups");
                    console.log(res);
                    isMounted && setGroups(res.data?.userGroups);
                } catch (err) {
                    navigate("/login", { state: { from: location }, replace: true });
                }
            };
            getGroups();

            return () => {
                effectRan.current = true;
            };
        }
    }, []);

    const renderGroups = () => {
        const temp = groups.map((item, index) => (
            <Grid key={index} item xs={4}>
                <Link className="group-tile" to={"/group/" + item.id_group + "/"}>
                    <h1>
                        {item.name}
                        <LabelImportantOutlinedIcon className="group-arrow" />
                    </h1>
                    <p>
                        {item.role} | {item.id_group}
                    </p>
                </Link>
            </Grid>
        ));
        return temp;
    };

    return (
        <div className="user-dashboard">
            <div className="app-top">
                <h1>User Dashboard</h1>
                <LabelImportantOutlinedIcon className="app-top-icon" />
            </div>
            <Container maxWidth="lg" className="app-content">
                <Grid container spacing={2}>
                    {groups.length === 0 ? <h5 className="no-groups">No groups to display</h5> : renderGroups()}
                </Grid>
            </Container>
        </div>
    );
};

export default UserDashboard;
