import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/table.css';
import { useState, useCallback } from 'react';


import emptyTableImage from '../assests/EmptyTable.gif';
import UserContext from "../context/user/UserContext";
import { useContext } from "react";
import UserTable from './UserTable.js';
import AdminTable from './AdminTable.js';
import ModeratorTable from './ModeratorTable.js';


const Table = ({ showNotification, toast }) => {
  const [data, setData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate();

  const {  user } = useContext(UserContext);
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url ="http://192.168.1.5:5000/expense/getAll"
      // const url = "https://expensetrackerbackend-wgbe.onrender.com/expense/getAll";
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authToken': token
        }
      });

      if(response.ok) {
        const result = await response.json();
        setData(result);
        setIsEmpty(result.length === 0);
      } else {
        toast.info("Please Login");
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [navigate,toast]); // Add dependencies here


  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete selected item?")) {
      const response = await toast.promise(
        fetch(`http://192.168.1.5:5000/expense/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }),
        {
          pending: 'Removing...',
          success: 'Item Removed 👌',
          error: 'Error removing data 🤯'
        }
      );
      if (response.ok) {
        fetchData(); // Refetch data after deletion
      } else {
        showNotification('Failed to delete expense. ', "error");
      }
    }
  }

  const renderRoleBasedTable = () => {
    console.log("User role: ",user.role);
    
    switch(user.role){
      case 3:
        return <UserTable data={data} isEmpty={isEmpty} handleDelete={handleDelete}/>
      case 1:
        return <AdminTable data={data} isEmpty={isEmpty} handleDelete={handleDelete}/>
      case 2:
        return <ModeratorTable data={data} isEmpty={isEmpty} handleDelete={handleDelete}/>
      default:
        <div className="is-flex is-flex-direction-column is-align-items-center">
              <img className="has-text-centered" src={emptyTableImage} alt='Add New Expense'/>
              <h2 className='is-size-3 has-text-grey-light has-text-centered'>Add an Expense to get started..</h2>
        </div>
      }

  }

  return <div className="table-container">{renderRoleBasedTable()}</div>;
  // return (<UserTable showNotification={showNotification}/>);
};

export default Table;
