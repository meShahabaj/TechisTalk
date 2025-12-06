import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading.tsx";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/checkAuth", {
                    withCredentials: true
                });

                if (res.data.auth === true) {

                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            } catch {
                setIsAuth(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) return <Loading />;

    return isAuth ? <Navigate to="/" /> : children;
};

export default PublicRoute;
