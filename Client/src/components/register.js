import React, { useState } from 'react';
import {baseUrl}  from '../constant/constant';
//import { Link } from "react-router-dom";


function Register(){
    
    const [first_name,setFirstName] = useState("");
    const [last_name,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message,setMessage] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [userRole,setUserRole] = useState("");

    const [firstNameErr,setFirstNameErr] = useState("");
    const [lastNameErr,setLastNameErr] = useState("");
    const [emailErr,setEmailErr] = useState("");
    const [passwordErr,setPasswordErr] = useState("");
    const [confirmPasswordErr,setConfirmPasswordErr] = useState("");
    const [userRoleErr,setUserRoleErr] = useState("");

    async function register()
    {
        const isValid = formValidation();
        if(isValid == true)
        {
        let request = await fetch(baseUrl+'register_user/',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:password,
                confirm_password:confirmPassword,
                project_name:'vendorTracker',
                user_role:userRole,

            })
        })

        let response = await request.json();
      console.log(response)
        if (response.Message.code === 200) {
            window.location.href = "/verifyLoginOTP/"+email;            
        } else if (response.Message.code == 400){
            if(response.Output == 'User Already Exists')
            {
                setMessage("User Already Exists")
            } else if(response.Output == 'Password does not match')     
            {
                setMessage("Password does not match")
            } else if (response.Output == 'Invalid Email')
            {
                setEmailErr("Please Enter only Fidel Domain emailID ")
            }
        }
        }
    }

    const formValidation = () =>{
        let isValidFirstName = true;
        let isValidLastName = true;
        let isValidEmail = true;
        let isValidPassword = true;
        let isValidConfirmPassword = true;
        let isValidUserRole = true;
        let isValid = true;
        let isValidEmailFormat = true;
        let isValidPasswordMatch = true;
        if(first_name == '')
        {
            setFirstNameErr('Please Enter First Name');
            isValidFirstName = false;
        } else
        {
            setFirstNameErr('');
            isValidFirstName = true;
        }

        if(last_name == '')
        {
            setLastNameErr('Please Enter Last Name');
            isValidLastName = false;
        } else
        {
            setLastNameErr('');
            isValidLastName = true;
        }

        if(email == '')
        {
            setEmailErr('Please Enter Email');
            isValidEmail = false;
        }else  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
        {
            setEmailErr('Please Enrer Valid Email');
            isValidEmail = false;
        } else
        {            
            setEmailErr('');
            isValidEmail = true;           
        }

       
        
        if(password == '')
        {
            setPasswordErr('Please Enter Password');
            isValidPassword = false;
        } else
        {
            setPasswordErr('');
            isValidPassword = true;
        }

        if(confirmPassword == '')
        {
            setConfirmPasswordErr('Please Enter Confirm Password');
            isValidConfirmPassword = false;
        } else
        {
            setConfirmPasswordErr('');
            isValidConfirmPassword = true;
        }

        if(userRole == '')
        {
            setUserRoleErr('Please Select User Role');
            isValidUserRole = false;
        } else
        {
            setUserRoleErr('');
            isValidUserRole = true;
        }

        if(password != confirmPassword)
        {
            setMessage("Password does not match")
            isValidPasswordMatch = false;
        } else
        {
            setMessage("");
            isValidPasswordMatch = true;
        }
        if(isValidFirstName == true && isValidLastName == true && isValidEmail == true && isValidPassword == true && isValidConfirmPassword == true && isValidUserRole == true && isValidEmailFormat == true)
        {
            isValid = true;
        }else
        {
            isValid = false;
        }

        return isValid;

    }

    return(
        <div style={{backgroundColor:"royalblue",height:"800px"}}>
        <div className="container" >

         
        <div className="row justify-content-center">

            <div className="col-xl-10 col-lg-12 col-md-9">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0" style={{height:"571"}}>
                            
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block" style={{backgroundImage:`url("./assets/img/login-700-img-web.jpg")`}} ></div>
                            <div className="col-lg-6">
                                <div className="p-5" style={{height:"700px"}}>
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Register</h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user"
                                                id="first_name" aria-describedby="emailHelp"
                                                placeholder="Enter First Name" onChange={(e) =>setFirstName(e.target.value)}/>
                                                 <p style={{color:'red'}}>{firstNameErr}</p>
                                        </div>

                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user"
                                                id="last_name" aria-describedby="emailHelp"
                                                placeholder="Enter Last Name" onChange={(e) =>setLastName(e.target.value)}/>
                                                 <p style={{color:'red'}}>{lastNameErr}</p>
                                        </div>
 

                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user"
                                                id="email" aria-describedby="emailHelp"
                                                placeholder="Enter Email Address" onChange={(e) =>setEmail(e.target.value)}/>
                                                 <p style={{color:'red'}}>{emailErr}</p>
                                        </div>

                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user"
                                                id="password" placeholder="Password" onChange={(e) =>setPassword(e.target.value)}/>
                                                 <p style={{color:'red'}}>{passwordErr}</p>
                                        </div>

                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user"
                                                id="confirmPassword" placeholder="Confirm Password" onChange={(e) =>setConfirmPassword(e.target.value)}/>
                                                 <p style={{color:'red'}}>{confirmPasswordErr}</p>
                                        </div>

                                        <div className="form-group">
                                        <select class="form-control" id="user_role" placeholder="User Role" name="user_role" onChange={(e) => setUserRole(e.target.value) }  >
                                        {/* <option> Select User Role</option> */}
                                        <option></option>
                                        <option value={'PC'}>PC</option>
                                        <option value={'PM'}>PM</option>
                                        <option value={'Sales'}>Sales</option>
                                        <option value={'VC'}>VC</option>
                                      
                               </select>
                               <p style={{color:'red'}}>{userRoleErr}</p>
                                        </div>
                                        
                                        <div className="form-group">
                                        <p style={{color:'red'}}>{message} </p>
                                        </div>
                                        <button className="btn btn-primary btn-user btn-block" onClick={register} type="button" > 
                                            Register
                                        </button>

                                        
                                        <hr/>
                                          
                                       
                                    </form>
                                     
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
    </div>
    )
}

export default Register