import React, {useState } from 'react';
import {baseUrl}  from '../constant/constant';
import { Link,useParams } from "react-router-dom";


function ResetPasswordValidateOTP(){
    const [userOTP,setUserOTP] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [message,setMessage] = useState("")

    let urlParam = useParams();
    let email = urlParam.email;
    console.log(email)
    
        async function SendOTP()
        {
            // if (password === confirmPassword)
            // {
            console.log('aaqaqaqa')
            // let result = await fetch(baseUrl+'login/',{
            //     method : 'POST',
            //     cache: 'no-cache',
            //     headers : {
            //                 'Content-Type': 'application/json; charset=utf-8',
            //                 'Accept' : 'application/json, text/plain'
                            
            //               },
            //     body : JSON.stringify({
            //         project_name:"vendorTracker",
            //         email:email,
                    
            //     })
            // })

            // result = await result.json();
            // console.log(result)
            // if(result.Output.code === 200)
            // {
            //     window.location.href = "/dashboard";
            // } else
            // {
            //     setMessage('Invalid Email !');
            // }
            // setMessage("")
            // } else
            // {
            //     setMessage("Password Not Match")
            // }
    } 

    return(
        <div style={{backgroundColor:"royalblue",height:"636px"}}>
        <div className="container" >

         
        <div className="row justify-content-center">

            <div className="col-xl-10 col-lg-12 col-md-9">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                            
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                            <div className="col-lg-6">
                                <div className="p-5" style={{height:"540px"}}>
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Reset Password Send OTP </h1>
                                    </div>
                                    <form className="user">
                                     
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user"
                                                id="password" aria-describedby="emailHelp"
                                                placeholder="Enter Password" onChange={(e) =>setPassword(e.target.value)} required="required" />
                                        </div>

                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user"
                                                id="confirmPassword" aria-describedby="emailHelp"
                                                placeholder="Enter Confirm Password" onChange={(e) =>setConfirmPassword(e.target.value)} />
                                        </div>

                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user"
                                                id="userOTP" aria-describedby="emailHelp"
                                                placeholder="Enter OTP" onChange={(e) =>setUserOTP(e.target.value)} />
                                        </div>


                                        <div className="form-group">
                                            <p style={{color:'red'}}>{message} </p>
                                        </div>

 
                                        <button onClick={SendOTP} type="button" className="btn btn-primary btn-user btn-block">
                                            Send OTP
                                        </button>
                                       
                                      
                                        {/* <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                            <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                        </a> */}
                                    </form>
                                    <hr/>
                                    <div className="text-center">
                                        <Link to={"/resetPassword"} className="small" >Reset Password</Link>
                                    </div>
                                   
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

export default ResetPasswordValidateOTP