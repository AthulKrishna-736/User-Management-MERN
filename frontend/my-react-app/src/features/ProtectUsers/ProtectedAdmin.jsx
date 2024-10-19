import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../store/config";
import { useDispatch } from "react-redux";
import { logout } from "../user/userLoginSlice";

function AdminProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(null); // Start with null to indicate loading
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/'); // Redirect to login if no token
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/api/users/check-auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response.data.message);
                const userIsAdmin = response.data.isAdmin;

                if (userIsAdmin) {
                    setIsAdmin(true); // User is admin
                    setIsAuth(true);
                } else {
                    navigate('/home'); // Redirect non-admin users to the home page
                }

            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('Token is expired from backend');
                    localStorage.removeItem('token');
                    console.log('Token removed');
                    dispatch(logout());
                    navigate('/');
                } else {
                    console.log(error.response?.data?.message || 'Authorization failed');
                }
                setIsAuth(false);
            }
        };

        checkAuth();
    }, [navigate, dispatch]);

    if (isAuth === null) {
        return <div>Loading...</div>; // Show loading state while checking auth
    }

    // If authenticated and admin, show the protected content (children)
    if (isAuth && isAdmin) {
        return <>{children}</>;
    }

    return null; // In case of failure to authenticate, show nothing (can be modified for better UX)
}

export default AdminProtectedRoute;
