import React,{useEffect,useState} from 'react'
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
import {baseUrl}  from '../constant/constant';
function UserProfile(){
    var userDetails;
    userDetails = JSON.parse(localStorage.getItem("userInfo"));
    // var userInformation;
const [userData,setUserData] = useState([]);
const [userInformation,setUserInformation] = useState();
    useEffect(() => {

        getUserDetails();
       
    },[])    
    
    const getUserDetails = async e => {
 
        const resultUser = await axios({
            method: 'post',
            url:  baseUrl+`get_user_details/`,
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                user_id: userDetails[0]
                 }
          }).then(responseAllStatus => setUserInformation(responseAllStatus)) 
        
        // console.log(resultUser.data.Output);  
        console.log(userInformation);
    } 

    // console.log( baseUrl+`get_user_details/`)
    // console.log(userInformation);
    return(

        <div id="wrapper">
            <Sidebar/> 
            <div id="content-wrapper" class="d-flex flex-column">
                <div id="content"> 
                <Header/> 
                <>


  

<div class="row" style={{marginLeft:"10px"}}>
 
<div class="col-lg-6">

    <div class="card mb-4 py-3 border-left-success">
        <div class="card-body">
         <b>    User Name : {userInformation.username} </b>
        </div>
    </div>

    <div class="card mb-4 py-3 border-left-info">
        <div class="card-body">
        <b>   User Full Name : {userInformation.name} </b>
        </div>
    </div>

    

</div>
 
<div class="col-lg-6">

    <div class="card mb-4 py-3 border-bottom-success">
        <div class="card-body">
          <b>  User Email ID : {userInformation.email} </b>
        </div>
    </div>

    <div class="card mb-4 py-3 border-bottom-info">
        <div class="card-body">
           <b> User Role : {userInformation.role} </b>
        </div>
    </div>

    

</div>

</div>

 </>
                 <Footer/>   
                </div>
            </div>
      
     </div>

    );
}

export default UserProfile;