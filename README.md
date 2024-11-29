Name: Anup Dhoble 
Email: anupdhoble15@gmail.com
Resume: https://anupdhoble.tech/resume

# Authentication and Authorization with Role-Based Access Control (RBAC)

> **Disclaimer**: The frontend code for this project was used as a foundation from a previous project. It already included the logic for creating expenses. In this project, I have added additional features for **Authentication**, **Authorization**, and **Role-Based Access Control (RBAC)**. These features were integrated to secure the application and manage user access based on roles such as Admin, Moderator, and User.

> **Note**: Due to some dependency issues and problems with the `dotenv` library, I am currently facing errors in deploying the frontend React.js application on **Netlify**. I am working to resolve these issues and will update the deployment link once fixed. **But frontend code is included in directory :- Frontend**

> Backend is succefully deployed on Render : https://expensetracker-backend-gu9c.onrender.com 

---

## Overview

This project implements a secure **Authentication** and **Authorization** system with **Role-Based Access Control (RBAC)**. It ensures that users can register, log in, and access resources based on their assigned roles, such as Admin, Moderator, and User. The system uses **JWT (JSON Web Tokens)** for session management, **bcrypt** for password hashing, and MongoDB as the database to store user information.

## Key Concepts

### 1. **JWT Authentication**
   - **JWT** is used to authenticate users and manage sessions. Instead of passing MongoDB’s `_id` directly in the requests, user-specific information such as user ID and role are encoded into a JWT and sent with each request.
   - The **JWT** is signed with a secret key: `"I am Anup"`. This ensures that only valid requests with a matching token can access protected resources.
   - The **JWT** payload includes user-specific information (user ID and role), allowing easy validation of the user's identity and access level without needing to query the database on every request.

### 2. **Password Hashing**
   - **bcrypt** is used to securely hash user passwords before storing them in MongoDB. The hashing ensures that passwords are never stored in plain text.
   - When a user attempts to log in, the hashed password is compared with the one provided in the login request using **bcrypt**’s `compare` method.

### 3. **Role-Based Access Control (RBAC)**
   - Users are assigned roles (Admin, Moderator, User) during registration. These roles determine the level of access granted to the user for different endpoints.
   - **Authorization middleware** checks the user’s role (retrieved from the JWT) and ensures they have permission to access specific resources.

## Middleware for Authentication and Authorization

### **Authentication Middleware (fetchUser)**

   - The **fetchUser** middleware validates the **JWT** sent with each request and decodes the user ID and role from the token.
   - This middleware is used in all protected routes to ensure the user is authenticated.
   - The decoded user data is attached to the `req.user` object, making it accessible to subsequent middlewares and route handlers.

### **Authorization Middleware**
   
   - In addition to the authentication middleware, the **Authorization Middleware** (checkPermissions.js file) is used for specific routes where user permissions need to be validated. For example, in the **Delete User** route, this middleware checks if the initiator has sufficient access permissions to delete another user.
   - This middleware checks:
     - If the **role** of the authenticated user (Admin, Moderator, User) matches the required role for the action.
     - If the user is authorized to perform actions like deleting or modifying resources based on their role.

   For example, an **Admin** can delete users, promote/demote users (e.g., make a User a Moderator), while a **Moderator** can only delete users, and a **User** can only create an expense.

### Role Permissions Overview

   - **Admin**: 
     - Can manage all users (add, delete, update, and change roles).
     - Can add a user to the **Moderator** role or vice versa.
     - Has full control over the system.
   - **Moderator**: 
     - Can delete a user but cannot modify their role.
     - Limited access to manage other users.
   - **User**: 
     - Can create expenses, but cannot delete other users or change their own role.

## Workflow

### 1. **User Registration**
   - A new user is registered with their `username`, `email`, `password`.
   - The password is hashed using **bcrypt** before storing it in the MongoDB database.
   - Once registered, a **JWT** is issued for the user.

### 2. **User Login**
   - During login, the user provides their `email` and `password`.
   - The system checks the credentials against the hashed password stored in the database using **bcrypt**.
   - If the credentials are valid, a **JWT** is issued and returned to the user for subsequent requests.

### 3. **Protected Routes**
   - Routes that require authentication  check if the request includes a valid JWT token.
   - The token is verified using the secret key `"I am Anup"`, and if valid, the user’s data (ID and role) is attached to the request object (`req.user`).
   - **Authorization middleware** checks the user’s role (retrieved from the JWT) to determine if they are allowed to access the resource or perform a specific action (e.g., delete a user).

## Security Features
   - Passwords are securely hashed using **bcrypt** before they are stored in the database.
   - **JWT tokens** are signed with a secret key, and **role-based access** ensures users only access what they are authorized for.
   - The system does not store or expose sensitive data like MongoDB `_id` directly but instead uses JWT to pass essential user data in a secure manner.

## Tools & Libraries
   - **Node.js**: JavaScript runtime for building the backend server.
   - **Express.js**: Web framework for routing and handling requests.
   - **JWT (jsonwebtoken)**: Used for authentication and session management.
   - **bcryptjs**: Library for securely hashing passwords.
   - **MongoDB**: Database for storing user data.
   - **Mongoose**: ODM for interacting with MongoDB in an object-oriented way.

## Routes Defined in code:
/expense/getAll : get all expenses of the userid passed, fetchUser middleware is authenticating the request
/expense/get:id : get a particular expense (for test purposes)
/expense/new: create new expense is being created for a user, fetchUser middleware is authenticating the request
/expense/put: For future use(to add fucntionality to update expenses details)
/expense/delete: For deleting expense , fetchUser middleware is authenticating the request

/user/auth: For login page, authnticate email and password
/user/new:  for signup page , create new user
/user/fetUser: Getuser details with token provided. Login required
/user/delete:  Autheticate the request(fetUser.js middleware), Authorize the user access level(checkPermissions.js middleware), and delete if respective user is present
/changeRole: user->moderator or moderator ->user, only admin can change role
