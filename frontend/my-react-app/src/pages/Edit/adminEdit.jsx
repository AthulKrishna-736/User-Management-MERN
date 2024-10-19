import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Import useParams to get the user ID from the URL
import axios from 'axios';
import BASE_URL from "../../store/config";
import './Edit.css';

function EditProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useParams(); 
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
 
    // Error states for validation
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [imageError, setImageError] = useState('');

    const usernamePattern = /^[a-zA-Z0-9_]{4,30}$/;
    const phonePattern = /^[0-9]{10}$/;

    const fromEditButton = location.state?.fromEditButton || false;

    useEffect(() => {
        console.log('edit button check = ', fromEditButton)
        if(!fromEditButton){
            navigate('/admin-dashboard',{ replace: true });
            return;
        }
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found');
                navigate('/'); // Redirect if token is not available
                return;
            }

            try {
                // Fetch the user by ID
                const response = await axios.get(`${BASE_URL}/admin/users/${userId}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
                setUsername(response.data.username);
                setPhone(response.data.phone);
                setImagePreview(`${BASE_URL}/${response.data.profileImage.replace(/\\/g, '/')}`);

            } catch (error) {
                console.error('Error fetching user data', error.message);
            }
        };
        
        fetchUserData();
    }, [navigate, userId, fromEditButton]); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file)); // Preview the image
        }
    };

    //validating input fields here
    const validateForm = () => {
        let isValid = true;

        // Username validation
        if (!usernamePattern.test(username)) {
            setUsernameError('Username must be 4-30 characters long and can only contain letters, numbers, and underscores.');
            isValid = false;
        } else {
            setUsernameError('');
        }

        // Phone validation
        if (!phonePattern.test(phone)) {
            setPhoneError('Phone number must be exactly 10 digits.');
            isValid = false;
        } else {
            setPhoneError('');
        }

        // Profile image validation (check if image is not selected)
        if (!profileImage) {
            setImageError('Profile image is required.');
            isValid = false;
        } else {
            setImageError('');
        }

     return isValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log('validation failed while editing user')
            return;  
        }

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('phone', phone);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            // Update user data using the userId
            await axios.put(`${BASE_URL}/admin/users/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${token}`,
                },
            });

            navigate('/admin-dashboard',{ replace: true }); // Adjust the path as needed
        } catch (error) {
            console.error('Error updating user data', error.message);
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit User Profile</h2>
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
                        {usernameError && <span className="error">{usernameError}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        {phoneError && <span className="error">{phoneError}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="profileImage">Profile Picture:</label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imageError && <p className="error">{imageError}</p>}
                        {imagePreview && <img src={imagePreview} alt="Profile Preview" className="image-preview" />}
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            )}
        </div>
    );
}

export default EditProfile;
