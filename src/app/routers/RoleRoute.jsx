import { Navigate } from "react-router-dom";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function RoleRoute({

    allow,

    children,

}) {

    const {

        data: user,

    } = useCurrentUser();

    if (!allow.includes(user.role)) {

        return <Navigate to="/forbidden" replace />;

    }

    return children;

}