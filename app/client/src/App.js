import { Routes, Route } from "react-router-dom";
import "./styles/reset.scss";
import "./styles/global.scss";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/requireAuth/RequireAuth";

import Home from "./pages/public/home/Home";
import Login from "./pages/public/login/Login";
import Register from "./pages/public/register/Register";
import Unauthorized from "./pages/public/unauthorized/Unauthorized";
import Missing from "./pages/public/missing/Missing";

import UserDashboard from "./pages/user/userDashboard/UserDashboard";
import UserSettings from "./pages/user/userSettings/UserSettings";

import GroupDashboard from "./pages/group/groupDashboard/GroupDashboard";
import GroupAddTransaction from "./pages/group/groupAddTransaction/GroupAddTransaction";
import GroupSettings from "./pages/group/groupSettings/GroupSettings";
import PreventAuth from "./components/preventAuth/PreventAuth";
import PersistLogin from "./components/persistLogin/PersistLogin";
import UserNewGroup from "./pages/user/userNewGroup/UserNewGroup";
import PreventLogged from "./components/preventLogged/PreventLogged";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route element={<PreventLogged />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                <Route path="unauthorized" element={<Unauthorized />} />

                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/create-group" element={<UserNewGroup />} />
                        <Route path="/settings" element={<UserSettings />} />

                        <Route element={<PreventAuth />}>
                            <Route path="/group/:id/">
                                <Route index element={<GroupDashboard />} />
                                <Route path="add-transaction" element={<GroupAddTransaction />} />
                                <Route path="settings" element={<GroupSettings />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    );
}

export default App;
