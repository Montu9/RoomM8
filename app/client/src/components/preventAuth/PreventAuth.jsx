import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Unauthorized from "../../pages/public/unauthorized/Unauthorized";

const PreventAuth = () => {
    const [isAuth, setIsAuth] = useState(false);
    const params = useParams();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const isMember = async () => {
            console.log(params.id);

            try {
                const path = "/group/" + params.id + "/isMember";

                await axiosPrivate.get(path);
                setIsAuth(true);
            } catch (err) {
                setIsAuth(false);
            }
        };
        isMember();
    }, []);

    return <>{isAuth ? <Outlet /> : <Unauthorized />}</>;
};

export default PreventAuth;
