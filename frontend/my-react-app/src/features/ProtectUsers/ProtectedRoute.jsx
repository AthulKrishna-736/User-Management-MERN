import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../store/config";
import { useDispatch } from "react-redux";
import { logout } from "../user/userLoginSlice";

function UserProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(null); // Start with null to indicate loading

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
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
                    // If the user is an admin, redirect them
                    navigate('/admin-dashboard');
                } else {
                    setIsAuth(true); // user is authenticated and not an admin
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
        return <div>Loading...</div>;
    }

    // If authenticated, show the protected content (children)
    if (isAuth) {
        return <>{children}</>;
    }

    return null;
}

export default UserProtectedRoute;
