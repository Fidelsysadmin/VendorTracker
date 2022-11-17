import React, {useState } from 'react';
import {baseUrl}  from '../constant/constant';
import { Link } from "react-router-dom";


function ResetPasswordSendOTP(){
    const [message,setMessage] = useState("");
    const [email,setEmail] = useState("");
  
   async function SendOTP()
    {
        let result = await fetch(baseUrl+'forgot_password/',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                application_name:"vendorTracker",
                email:email,
                
            })
        })

        result = await result.json();
        console.log(result)
        if(result.Message.code === 200)
        {
            window.location.href = "/resetPasswordValidateOTP/"+email;
        } else
        {
            setMessage('Invalid Email !');
        }
    }
    

    return(
        <div style={{backgroundColor:"royalblue",height:"636px;"}}>
        <div className="container" >

         
        <div className="row justify-content-center">

            <div className="col-xl-10 col-lg-12 col-md-9">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                            
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                            <div className="col-lg-6">
                                <div className="p-5" style={{height:"540px"}} >
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Reset Password Send OTP </h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user"
                                                id="email" aria-describedby="emailHelp"
                                                placeholder="Enter Email" onChange={(e) =>setEmail(e.target.value)} />
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

export default ResetPasswordSendOTP