import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./groupAddTransaction.scss";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";

const GroupAddTransaction = () => {
    const params = useParams();
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [title, setTitle] = useState("");
    const [charge, setCharge] = useState(0);
    const [category, setCategory] = useState("Groceries");
    const [categories, setCategories] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);
    const effectRan = useRef(false);

    useEffect(() => {
        const path = "/group/" + params.id + "/getUserTransactions";
        if (effectRan.current === false) {
            let isMounted = true;

            const getCategories = async () => {
                try {
                    const res = await axiosPrivate.get("/transaction/categories");
                    const res2 = await axiosPrivate.get(path);
                    console.log(res.data?.transactionCategories);

                    if (isMounted) {
                        if (Array.isArray(res2.data?.userTransactions)) {
                            setUserTransactions(res2.data?.userTransactions);
                        } else setUserTransactions([]);
                        setCategories(res.data?.transactionCategories);
                    }
                } catch (err) {
                    navigate("/login", { state: { from: location }, replace: true });
                }
            };
            getCategories();

            return () => {
                effectRan.current = true;
            };
        }
    }, []);

    useEffect(() => {
        setErrMsg("");
        setSuccessMsg("");
    }, [title, charge, category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        const path = "/transaction/" + params.id;
        try {
            const res = await axiosPrivate.post(path, JSON.stringify({ title, charge, category }));

            setUserTransactions((prev) => {
                return [...prev, res.data?.transaction];
            });
            setSuccessMsg("Transaction added.");
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
        }
    };

    const handleDelete = async (id_transaction) => {
        const path = "/group/" + params.id + "/deleteTransaction/" + id_transaction;

        try {
            await axiosPrivate.delete(path);
            const newTransactions = userTransactions.filter((item) => {
                return item._id !== id_transaction;
            });
            setUserTransactions(newTransactions);
        } catch (err) {}
    };

    const renderCategories = () => {
        const temp = categories.map((item, index) => (
            <option key={index} value={item.name}>
                {item.name}
            </option>
        ));

        return temp;
    };

    const renderUserTransactions = () => {
        console.log(userTransactions);

        const temp = userTransactions.map((item, index) => (
            <tr key={index}>
                <td>{item.title}</td>
                <td>{item._id}</td>
                <td>{item.createdAt}</td>
                <td>{item.charge}</td>
                <td>
                    <input type="button" value="Delete" onClick={(e) => handleDelete(item._id)} />
                </td>
            </tr>
        ));
        return temp;
    };

    return (
        <div className="group-add-transaction">
            <div className="app-top">
                <h1>Add New Transaction</h1>
                <LabelImportantOutlinedIcon className="app-top-icon" />
            </div>
            <Container maxWidth="lg" className="app-content">
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <div className="tile">
                            <form onSubmit={handleSubmit}>
                                <h1>Add new cost</h1>
                                <p className={errMsg ? "error-msg" : "offscreen"}>{errMsg}</p>
                                <p className={successMsg ? "success-msg" : "offscreen"}>{successMsg}</p>
                                <div className="input-container">
                                    <input
                                        onChange={(e) => setTitle(e.target.value)}
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder=" "
                                        value={title}
                                        required
                                    />
                                    <label htmlFor="title">Transaction title</label>
                                </div>
                                <div className="input-container">
                                    <input
                                        onChange={(e) => setCharge(e.target.value)}
                                        type="text"
                                        name="charge"
                                        id="charge"
                                        placeholder=" "
                                        value={charge}
                                        required
                                    />
                                    <label htmlFor="charge">Charge</label>
                                </div>
                                <div className="input-container">
                                    <select
                                        onChange={(e) => setCategory(e.target.value)}
                                        name="category"
                                        id="category"
                                        defaultValue="Groceries"
                                    >
                                        {renderCategories()}
                                    </select>
                                </div>
                                <input type="submit" value="Create New Transaction" />
                            </form>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <table className="tile">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Transaction ID</th>
                                    <th>Date</th>
                                    <th>Charge</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>{renderUserTransactions()}</tbody>
                        </table>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default GroupAddTransaction;
