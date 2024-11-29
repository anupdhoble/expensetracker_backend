import React, { useEffect, useState } from 'react';
import UserContext from "./UserContext"; 
import { toast } from 'react-toastify';

function AuthState(props) {  
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
      if(localStorage.getItem('authToken')===null){
        setIsLoggedIn(false);
        alert("Please Login...");
        localStorage.removeItem('authToken');
        window.location.href = '/expensetrackerfrontend/#/login';
        setLoading(false);
      }
        // Check if the user is logged in based on some asynchronous operation
        const checkLoginStatus = async () => {
          try {
            const token = localStorage.getItem('authToken');
            if(token){
              setIsLoggedIn(true);  
            } else {
              setIsLoggedIn(false);
            }
          } catch (error) {
            console.error('Error checking login status:', error);
          }
        };
    
        checkLoginStatus();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    useEffect(() => {
        const getUserInfo = async () => {
          try {
            const url = "http://192.168.1.5:5000/user/getUser";
            const token = localStorage.getItem('authToken');
            if (token) {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'authToken': token
                }
              });
              if (response.ok) {
                const data = await response.json();
                setUser(data); 
              } else {
                console.error('Failed to fetch user info:', response.statusText);
              }
            }
          } catch (error) {
            console.error('Error fetching user info:', error);
          } finally{
            setLoading(false);
          }
        };

        if (isLoggedIn) {
          getUserInfo();
        }
    }, [isLoggedIn]); // Runs only when `isLoggedIn` changes

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
        toast.success("Logged out...");
        window.location.href = '/expensetrackerfrontend/#/login';
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, handleLogout, handleLogin, user,loading }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default AuthState;
