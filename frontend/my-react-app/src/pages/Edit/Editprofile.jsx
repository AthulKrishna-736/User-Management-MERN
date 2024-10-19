import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import BASE_URL from "../../store/config";
import './Edit.css';

function EditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState(''); // State for phone number
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found');
                navigate('/'); // Redirect to home or login if token is not available
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/api/users/me`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
                setUsername(response.data.username);
                setPhone(response.data.phone); // Set the phone number
                setImagePreview(`${BASE_URL}/${response.data.profileImage.replace(/\\/g, '/')}`);
            } catch (error) {
                console.error('Error fetching user data', error.message);
            }
        };
        
        fetchUserData();
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file)); // Preview the image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('phone', phone);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        console.log('Form Data:', {
            username,
            phone,
            profileImage
        });
        
        try {
            await axios.put(`${BASE_URL}/api/users/me`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${token}`,
                },
            });

            // Optionally navigate back to profile page or home after successful edit
            navigate('/home'); // Adjust the path as needed
        } catch (error) {
            console.error('Error updating user data', error.message);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {user && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)} // Update phone number state
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profileImage">Profile Picture:</label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && <img src={imagePreview} alt="Profile Preview" className="image-preview" />}
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            )}
        </div>
    );
}

export default EditProfile;
