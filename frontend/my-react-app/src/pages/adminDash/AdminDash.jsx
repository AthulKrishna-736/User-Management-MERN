import React, { useEffect, useState } from 'react';
import './AdminDashboard.css'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/user/userLoginSlice';
import BASE_URL from '../../store/config';
import axios from 'axios';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const adminName = localStorage.getItem('adminName');
    const adminProfilePic = localStorage.getItem('adminProfile');


    const handleLogout = () => {
        console.log('Token getting deleted from local storage');
        localStorage.removeItem('token');
        console.log('Navigating to the login page');
        dispatch(logout());
        navigate('/');
    };

    const handleEditUser = (userId) => {
        console.log('userid = from = ',userId)
        navigate(`/edit-userprofile/${userId}`,{
            state: {
                fromEditButton: true,
            },
            replace: true,
        })
    };

    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('token')

        try {
            await axios.delete(`${BASE_URL}/admin/users/${userId}`,{
                headers:{
                    authorization: `Bearer ${token}`
                }
            })

            setUsers((prevUsers)=> prevUsers.filter((user)=> user._id !== userId))
            console.log('user deleted successfully')
            navigate('/admin-dashboard');

        } catch (error) {
            console.error('error deleting user', error.message);
        }
    };

    const handleCreateUser = ()=>{
        const token = localStorage.getItem('token')

        if(token){
            navigate('/create-user')
        }
    }

    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.background = 'linear-gradient(135deg, #4e54c8, #8f94fb)'; 

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('admin token =  ',token)
                const response = await axios.get(`${BASE_URL}/admin/users`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();

        return () => {
            document.body.style.margin = '0px';
            document.body.style.backgroundColor = 'white'
        };
    }, []);
    
    // Filter users based on the search term (only if it starts with the term)
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-dashboard">

            <header className="admin-header">
                <h2>Welcome, {adminName}!</h2>
                <nav className="admin-nav">
                    <div className="admin-profile">
                        <img src={`${BASE_URL}/${adminProfilePic}`} alt="Admin Profile" className="admin-profile-pic" />
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <button onClick={handleCreateUser}className="create-user-button">Create User</button>
                </nav>
            </header>

            <main className="admin-body">

                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="search-box"
                />

                <table className="user-table">

                    <thead>
                        <tr>
                            <th>Profile Picture</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                    No users exist.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <img 
                                            src={`${BASE_URL}/${user.profileImage}`} 
                                            alt={`${user.username}'s profile`} 
                                            className="user-profile-pic" 
                                        />
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="button-container">
                                            <button className="edit-btn" onClick={() => handleEditUser(user._id)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    
                </table>
            </main>
        </div>
    );
}

export default AdminDashboard;
