import React, { useState} from "react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "./Register.css";
import CancelIcon from '@mui/icons-material/Cancel';
import { register } from "../services/user-services";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const registerSuccess = () => {
  toast.success("Registered successfully!")
}

const registerFail = () => {
  toast.error("Please fill in the data correctly.")
}

const Register = ({setShowRegister}) => {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [userNameError, setUserNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleRegSubmit = async (e) => {
        e.preventDefault();
        const user = {userName, email, password};
        try {
          const response = await register(user);
          registerSuccess()
          setShowRegister(false)
          console.log(response);
        } catch (error) {
          registerFail()
          if (error.response && error.response.data && error.response.data.error) {
            const { errors } = error.response.data.error;
            if (errors.userName) {
              setUserNameError(errors.userName.message);
            }
            if (errors.email) {
              setEmailError(errors.email.message);
            }
            if (errors.password) {
              setPasswordError(errors.password.message);
            }
          } else {
            console.error(error);
          }
        }
      };

    return(
        <div className="register-container">
            <div className="register-box">
                <PersonAddIcon/>
                <h2>Create Account</h2>
            </div>
            <form className="form-1" onSubmit={handleRegSubmit}>
                <input type = "text" placeholder="Enter a username" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                {userNameError && (
                <span>{userNameError}</span>
                )}
                <input type = "email" placeholder="Enter a email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                {emailError && (
                <span>{emailError}</span>
                )}
                <input type = "password" placeholder="Enter a password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {passwordError && (
                <span>{passwordError}</span>
                )}
                <button className="register-button">Join up!</button>
            </form>
            <CancelIcon className="cancel-icon" onClick={() => setShowRegister(false)} fontSize="small"/>

        </div>
    )
}

export default Register;