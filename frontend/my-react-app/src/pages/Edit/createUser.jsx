import React, { useState } from 'react';
import InputBox from '../../component/inputBox/InputBox';
import Button from '../../component/button/Button';
import { useNavigate } from 'react-router-dom';
import './CreateUser.css'; // Adjust CSS file as needed
import axios from 'axios';
import BASE_URL from '../../store/config';


function CreateUser() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    //regex for validating user
    const usernamePattern = /^[a-zA-Z0-9_]{4,30}$/
    const emailPattern = /^[a-zA-Z0-9_]+@[a-zA-Z]+\.[a-zA-Z]+$/
    const passPattern = /^[a-zA-Z0-9_]{6,18}$/
    const phonePattern = /^[0-9]{10}$/    

    const handleUsername = (e) => setUsername(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePhone = (e) => setPhone(e.target.value);
    const handlePass = (e) => setPassword(e.target.value);
    const handleProfileImage = (e) => setProfileImage(e.target.files[0]);

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validate username
        if (!usernamePattern.test(username)) {
            newErrors.usernameError = 'Username must be 4-30 characters long and can only contain letters, numbers, and underscores.';
            isValid = false;
        }

        // Validate email
        if (!emailPattern.test(email)) {
            newErrors.emailError = 'Please enter a valid email address.';
            isValid = false;
        }

        // Validate phone number
        if (!phonePattern.test(phone)) {
            newErrors.phoneError = 'Phone number must be exactly 10 digits.';
            isValid = false;
        }

        // Validate password
        if (!passPattern.test(password)) {
            newErrors.passwordError = 'Password must be 6-18 characters long and can only contain letters, numbers, and underscores.';
            isValid = false;
        }

        // Validate profile image (check if an image is selected)
        if (!profileImage) {
            newErrors.profileImageError = 'Profile image is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };    

    const handleCreateUser = async() => {

        if (!validateForm()) {
            console.log('cant create user validation error')
            return;  
        }    
        console.log('Creating user...');

        // Create FormData object to send data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        if (profileImage) {
        formData.append('profileImage', profileImage);
       } 

       try {
        const token = localStorage.getItem('token')
        console.log('token check form',token)        

        const response = await axios.post(`${BASE_URL}/admin/users`, formData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        
        console.log(response.data); 
        navigate('/admin-dashboard');
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // Request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something else caused an error
            console.error('Error:', error.message);
        }
        }
       
    };

    return (
        <div className="create-user-page">
            <div className="create-user-box">
                <h1>Create User</h1>

                <InputBox 
                    type='text'
                    placeholder='Enter username'
                    value={username}
                    onChange={handleUsername}
                />
                {errors.usernameError && <p className="error-message">{errors.usernameError}</p>}

                <InputBox 
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={handleEmail}
                />
                {errors.emailError && <p className="error-message">{errors.emailError}</p>}

                <InputBox 
                    type='text'
                    placeholder='Enter phone'
                    value={phone}
                    onChange={handlePhone}
                />
                {errors.phoneError && <p className="error-message">{errors.phoneError}</p>}

                <InputBox
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={handlePass}
                />
                {errors.passwordError && <p className="error-message">{errors.passwordError}</p>}

                <InputBox 
                    type='file'
                    accept='image/*'
                    onChange={handleProfileImage}
                />
                {errors.profileImageError && <p className="error-message">{errors.profileImageError}</p>}

                <Button label='Create User' onClickFn={handleCreateUser} />

                <p className="back-to-dashboard-message">
                  Go back to <span className="dashboard-link" onClick={() => navigate('/admin-dashboard')}>Dashboard</span>
                </p>
            </div>
        </div>
    );
}

export default CreateUser;
