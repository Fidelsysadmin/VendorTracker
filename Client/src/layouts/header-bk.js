import React,{useEffect, useState} from 'react'
import {baseUrl,apiUrl}  from '../constant/constant';
import{useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Icon from "react-crud-icons";
function Header() {
let navigate = useNavigate();
var userDetails;
let userInfo = [];
var arUser = [];
 userInfo = JSON.parse(localStorage.getItem("userInfo"));
const [notificationCount,setNotificationCount] = useState([]);
const [notificationList,setNotificationList] = useState()
const [userList,setUserList] = useState([])
const [userName,setUserName] = useState();
if(!userInfo)
{
  window.location.href = "/";
   
}

function Logout(){
    localStorage.clear();
     navigate("/");
}

useEffect(() => {

    getUserDetails();
   
},[])    

const getUserDetails = async e => {
      
    const resultUser = await axios({
        method: 'post',
        url:  baseUrl+`get_user_details/`,
        data: {
            user_id: userInfo[0]
             }
      });
      setUserName(resultUser.data.Output.name);  

      let result = await axios.get(apiUrl+`requestNotificationCount`);
      setNotificationCount(result.data.notificationCount);
      
      result = await axios.get(apiUrl+`requestNotificationList`);
      setNotificationList(result.data);

      result = await axios.get(baseUrl+`all_user_list`);
      setUserList(result.data.Output);   
     

} 

async function updateRequest(id){     
    await axios.delete(apiUrl+`updateNotificationFlag/${id}`);
    var newNotificationList = notificationList.filter((item) => {
        return item.id !== id;
    })
    setNotificationList(newNotificationList);
    setNotificationCount(notificationCount-1);

}

userList.map((item,index) =>{
    arUser[item.id] = item.name
})
   
    return (
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <ul class="navbar-nav ml-auto">

                        <li class="nav-item dropdown no-arrow d-sm-none">
                            <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-search fa-fw"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                aria-labelledby="searchDropdown">
                                <form class="form-inline mr-auto w-100 navbar-search">
                                    <div class="input-group">
                                        <input type="text" class="form-control bg-light border-0 small"
                                            placeholder="Search for..." aria-label="Search"
                                            aria-describedby="basic-addon2"/>
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="button">
                                                <i class="fas fa-search fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </li>
                        { userInfo && (userInfo[1] === 'VM' || userInfo[1] === 'VC') && (  
          <>
                        <li class="nav-item dropdown no-arrow mx-1">

                            <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-bell fa-fw"></i>
                                 
                                <span class="badge badge-danger badge-counter">{notificationCount}</span>
                            </a>
                            
                            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="alertsDropdown">
                                <h6 class="dropdown-header">
                                   New Requests
                                </h6>
                              
                                  {
                                      notificationList?.map((item, i) => {
                                          return (
                                   <>
                              <a class="dropdown-item d-flex align-items-center" onClick={() => updateRequest(item.id)}>
                                
                                    <div class="mr-3">
                                        <div class="icon-circle bg-success">
                                            <i class="fas fa-donate text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">Request from </div>
                                       {arUser[item.user_id]}
                                       <span style={{marginLeft:40}}>
                                       <Icon  name = "check" tooltip = "" theme = "light" size = "medium">
                                                        </Icon>
                                                        </span>
                                    </div>
                                    
                                </a> 
                                </>
                                )
                            })
                        }
                                 

                            </div>
                        </li>
                        </>
        )
}
                        <div class="topbar-divider d-none d-sm-block"></div>

                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="mr-2 d-none d-lg-inline text-gray-600 small">{userName}</span>
                                <img class="img-profile rounded-circle"
                                    src="../assets/img/undraw_profile.svg"/>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">
                               
                              
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal" onClick={Logout} >
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>
    )
}

export default Header
