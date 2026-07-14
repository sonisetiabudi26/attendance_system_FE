import { Navigate } from "react-router-dom";

import Spinner from "@/shared/components/common/Spinner";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function ProtectedRoute({ children }) {

    const token = localStorage.getItem("accessToken");

    const {
        data: user,
        isLoading,
        error
    } = useCurrentUser();


    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return <Spinner fullscreen />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}