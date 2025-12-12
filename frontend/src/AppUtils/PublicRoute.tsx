import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../Redux/store";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/search-friends" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
