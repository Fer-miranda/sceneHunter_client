import React, { useState} from "react";
import './Login.css';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CancelIcon from '@mui/icons-material/Cancel';
import { login } from "../services/user-services";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const logginSuccess = () => {
  toast.success("Login successfully!")
}

const logginFail = () => {
  toast.error("Login failed. Please fill the data correctly.")
}

const Login = ({setShowLogin, setCurrentUser}) => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        const user = {userName, password};
        try {
            const response = await login(user);
            logginSuccess();
            console.log(response);
            localStorage.setItem('currentUser', JSON.stringify(user.userName));
            setCurrentUser(userName)
            setShowLogin(false)
        } catch (error) {
            logginFail();
            if (error.response && error.response.data && error.response.data.msg) {
              setLoginError(error.response.data.msg);
            } else {
              console.error(error);
            }
          }
        };


    return(
        <div className="login-container">
            <div className="login_box">
                <AccountBoxIcon/>
                <h2>Login</h2>
            </div>
            <form className="form-1" onSubmit={handleLogSubmit}>
                <input type="text" placeholder="Enter your username" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {loginError && <span>{loginError}</span>}
                <button className="login-button">Let's hunt scenes</button>
            </form>
            <CancelIcon className="cancel-icon" onClick={() => setShowLogin(false)} fontSize="small"/>
        </div>
    )
}

export default Login;












// import React, {useRef, useState} from "react";
// import './Login.css';
// import AccountBoxIcon from '@mui/icons-material/AccountBox';
// import CancelIcon from '@mui/icons-material/Cancel';
// import axios from 'axios';
// import { login } from "../services/user-services";

// const Login = ({setShowLogin, setCurrentUser}) => {

//   const nameRef = useRef()
//   const passRef = useRef()


//     const handleLogSubmit = async (e) => {
//         e.preventDefault();
//         const newUser = {
//           userName : nameRef.current.value,
//           password : passRef.current.value
//       }
//         try {
//             const response = await login(newUser);
//             console.log(response);
//             setCurrentUser(response.data.userName);
//             setShowLogin(false)
//         } catch (error) {
//           console.error(error);
//         }
//       };

//     return(
//         <div className="login-container">
//             <div className="login_box">
//                 <AccountBoxIcon/>
//                 <h2>Login</h2>
//             </div>
//             <form onSubmit={handleLogSubmit}>
//                 <input type="text" placeholder="Enter your username" ref = {nameRef}/>
//                 <input type="password" placeholder="Enter your password" ref = {passRef}/>
//                 <button className="login-button">Login</button>
//             </form>
//             <CancelIcon className="cancel-icon" onClick={() => setShowLogin(false)} fontSize="small"/>
//         </div>
//     )
// }

// export default Login;











