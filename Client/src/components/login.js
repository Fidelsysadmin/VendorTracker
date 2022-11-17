import React, {useState } from 'react';
import {baseUrl}  from '../constant/constant';
import { Link,useNavigate} from "react-router-dom";
import {Chatbot} from './Chatbot.js';
import { Helmet } from 'react-helmet';

function Login(){
    let navigate = useNavigate();
    const [message,setMessage] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [userNameErr,setUserNameErr] = useState("");
    const [passwordErr,setPasswordErr] = useState("");
   async function login()
    {
        const isValid = formValidation();
        if(isValid == true)
        {
        let result = await fetch(baseUrl+'login/',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                project_name:"vendorTracker",
                email:email,
                password:password,

            })
        })

        result = await result.json();
           console.log(result)
        var userInfo = [];
        userInfo[0] = result.user_id;
        userInfo[1] = result.user_role;
        userInfo[2] = result.Message.code;
        userInfo[3] = result.Message.message;
            if(result.Message === 'OTP successfully send please verify it')
            {
                //localStorage.setItem('userInfo',JSON.stringify(userInfo));
                // window.location.href = "/dashboard";
                navigate(`/verifyUserLoginOTP/${email}`);

            } else
            {
                setMessage('Invalid Credentails !');
            }
        }
    }
    
    const formValidation = () =>{
        let isValidUserName = true;
        let isValidPassword = true;
        let isValid = true;
        if(email == '')
        {
            setUserNameErr('Please Enter UserName');
            isValidUserName = false;
        } else
        {
            setUserNameErr('');
            isValidUserName = true;
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

        if(isValidUserName == true && isValidPassword == true)
        {
            isValid = true;
        }else
        {
            isValid = false;
        }

        return isValid;

    }
    return(
        <div style={{backgroundColor:"royalblue",height:"636px"}}>
        <div className="container" >

         
        <div className="row justify-content-center">

            <div className="col-xl-10 col-lg-12 col-md-9">

                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                            
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block" style={{backgroundImage:`url("./assets/img/login-img.jpg")`}}></div>
                            <div className="col-lg-6" style={{height:"540px"}}>
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user"
                                                id="email" aria-describedby="emailHelp"
                                                placeholder="Enter User Name" onChange={(e) =>setEmail(e.target.value)} />
                                                 <p style={{color:'red'}}>{userNameErr}</p>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user"
                                                id="password" placeholder="Password" onChange={(e) =>setPassword(e.target.value)} />
                                                 <p style={{color:'red'}}>{passwordErr}</p>
                                        </div>

                                        <div className="form-group">
                                            <p style={{color:'red'}}>{message} </p>
                                        </div>

 
                                        <button onClick={login} type="button" className="btn btn-primary btn-user btn-block">
                                            Login
                                        </button>
                                        <hr/>
                                        <Link to="/register"><button type='button' className="btn btn-success btn-user btn-block"> Register
                                        </button></Link>
                                      
                                        {/* <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                            <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                        </a> */}
                                    </form>
                                    <Helmet>
      					<script  src="http://192.168.1.159:3000/assets/modules/channel-web/inject.js" >
      					</script>
      				     </Helmet>
                                    <hr/>
                                                                     
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

export default Login
