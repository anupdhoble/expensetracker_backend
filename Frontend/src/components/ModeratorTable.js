import { React, useState, useEffect } from 'react';
import emptyTableImage from '../assests/EmptyTable.gif';
import { useContext } from 'react';
import UserContext from '../context/user/UserContext';

const url = "http://192.168.1.5:5000/user";

const ModeratorTable = () => {
    const [data, setData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const { user, handleLogout } = useContext(UserContext);

    // Fetch all users when the component mounts
    const getAllUsersData = async () => {
        try {
            let token = localStorage.getItem('authToken');
            if (!token) {
                alert("Please Login");
                handleLogout();
                return;
            }

            const response = await fetch(url + "/getAll", {
                method: 'GET',
                headers: {
                    "authToken": token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.length === 0) {
                    setIsEmpty(true);
                } else {
                    setData(result);
                    setIsEmpty(false); // If there are users, set to false
                }
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Delete a user and then refresh the list
    const handleUserDelete = async (id) => {
        if (window.confirm("Do you want to delete selected item?")) {
            try {
                let token = localStorage.getItem('authToken');
                if (!token) {
                    alert("Please Login");
                    handleLogout();
                    return;
                }

                const response = await fetch(url +"/delete", {
                    method: "DELETE",
                    headers: {
                        "authToken": token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ deleteUserId: id })
                });

                if (response.ok) {
                    alert("User Deleted Successfully");
                    getAllUsersData();
                } else {
                    console.error('Failed to delete user:', response.statusText);
                }

            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }

    // Call the getAllUsersData once when the component mounts
    useEffect(() => {
        getAllUsersData();
    }, []);

    return (
        <div>
            <div className='is-size-3 has-text-grey-light has-text-centered'>Moderator Console</div>
            <h6 className="subtitle is-6 has-text-centered">(You can only manipulate user data)</h6>
            <div className="table-container">
                {isEmpty ? (
                    <div className="is-flex is-flex-direction-column is-align-items-center">
                        <img className="has-text-centered" src={emptyTableImage} alt='No Moderators Found' />
                        <h2 className='is-size-3 has-text-grey-light has-text-centered'>Nothing to display..</h2>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Time Joined</th>
                                <th>Role</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.name}</td>
                                    <td>{row.email}</td>
                                    <td>{row.date}</td>
                                    <td>
                                        {row.role === 1 ? (
                                            "Admin" + (user._id === row._id ? " (own)" : "")
                                        ) : row.role === 2 ? (
                                            "Moderator" + (user._id === row._id ? " (own)" : "")
                                        ) : (
                                            "User"
                                        )}
                                    </td>

                                    {(user._id === row._id || row.role !== 3 ?
                                        <td><button className="button is-danger" disabled>🗑️</button></td>
                                        :
                                        <td><button className="button is-danger" onClick={() => handleUserDelete(row._id)}>🗑️</button></td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ModeratorTable;
