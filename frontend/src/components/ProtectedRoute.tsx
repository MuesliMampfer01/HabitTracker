import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Auth check, weitere Seiten laden erst, wenn man gewisse Authentication durch hat
export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg text-gray-600">Loading Authentication...</p>
            </div>
        );
    }

    // nicht eingeloggt -> zum login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    //eingeloggt -> anzeigen der Unter-Seite
    return <Outlet />
}
