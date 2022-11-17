import React, { useState } from 'react';
import {baseUrl}  from '../constant/constant';
import { useParams,useNavigate} from "react-router-dom";
//import { Link } from "react-router-dom";


function VerifyUserLoginOTP(){
    let navigate = useNavigate();
    const [userOTP,setUserOTP] = useState("");
    const [message,setMessage] = useState("");
    let urlParam = useParams();
    let email = urlParam.email;
    async function verifyOTP()
    {
       console.warn(email)
        let request = await fetch(baseUrl+'verify_login_otp/',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                otp:userOTP,
                application_name:'vendorTracker',
                email : email
            })
        })

        let response = await request.json();
        // console.log(response)
       
        var userInfo = [];
        userInfo[0] = response.user_id;
        userInfo[1] = response.user_role;
        userInfo[2] = response.Message.code;
        userInfo[3] = response.Message.message;
            if(response.Message.message === 'success')
            {
                localStorage.setItem('userInfo',JSON.stringify(userInfo));
                // window.location.href = "/dashboard";
                navigate("/dashboard");

            } else
            {
                setMessage('Invalid OTP !');
            }
        

         
    }

    return(
        <div style={{backgroundColor:"royalblue",height:"636px"}}>
        <div className="container" >

         
        <div className="row justify-content-center">

            <div className="col-xl-10 col-lg-12 col-md-9">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                            
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block" style={{backgroundImage:`url("/assets/img/login-img.jpg")`}}></div>
                            <div className="col-lg-6" style={{height:"540px"}}>
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Verify OTP</h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user"
                                                id="userOTP" aria-describedby="emailHelp"
                                                placeholder="Enter OTP" onChange={(e) =>setUserOTP(e.target.value)}/>
                                        </div>
                                        <div className="form-group">
                                        <p style={{color:"red"}}> {message}</p>
                                        </div>
                                        <button className="btn btn-primary btn-user btn-block" onClick={verifyOTP} type="button" > 
                                            Verify
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

export default VerifyUserLoginOTP