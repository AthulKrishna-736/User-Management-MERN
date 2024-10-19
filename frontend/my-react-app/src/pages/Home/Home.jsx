import React, { useEffect, useState } from "react";
import './Home.css'
import Header from "../../component/header/Header";
import BASE_URL from "../../store/config";
import axios from 'axios'

function Home(){
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const fetchUserData = async()=>{
            const token = localStorage.getItem('token');

            if(!token) {
                console.error('NO token found')    
                return
            };

            try {
                const response = await axios.get(`${BASE_URL}/api/users/me`,{
                    headers:{
                        authorization: `Bearer ${token}`,
                    },
                })

                console.log(response.data)

                setUser(response.data);

            } catch (error) {
                console.error('Error fetching user data', error.message)
            }
        }
        fetchUserData();
    },[]);

    return (
        <div className="home-div">
            {user && ( // Check if user data is available
                <Header 
                    profilePic={`${BASE_URL}/${user.profileImage.replace(/\\/g, '/')}`} // Pass the profile picture
                    username={user.username} // Pass the username
                />
            )}
            <div className="body-div">
                {user && ( // Check if user data is available
                    <div className="profile-container">
                        <img 
                            className='profile-pic' 
                            src={`${BASE_URL}/${user.profileImage.replace(/\\/g, '/')}`}
                            alt="user-profile" 
                        />
                        <div className="profile-details">
                            <span className="profile-detail"><strong>Username:</strong> {user.username}</span>
                            <span className="profile-detail"><strong>Email:</strong> {user.email}</span>
                            <span className="profile-detail"><strong>Phone:</strong> {user.phone}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    

}

export default Home;