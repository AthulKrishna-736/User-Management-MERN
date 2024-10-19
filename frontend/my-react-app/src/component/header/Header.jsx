import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/user/userLoginSlice";

function Header({profilePic, username}){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = ()=>{
        console.log('token getting deleted from loc storage')
        localStorage.removeItem('token');

        console.log('navigating to the login page')

        dispatch(logout())

        navigate('/')
    }

    const handleEdit = ()=>{
        navigate('/edit-profile')
    }

    return(
        <div className="header-div">
            <h2 className="welcome">Welcome, {username}</h2>
            <div className="header-right">
                <img src={profilePic} alt="user-profile" />
                <button className="edit-btn" onClick={handleEdit}>Edit</button>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Header;

