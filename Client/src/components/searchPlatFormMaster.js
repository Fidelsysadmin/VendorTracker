import React,{useEffect,useState} from 'react'
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
import {apiUrl}  from '../constant/constant';
import { Link } from 'react-router-dom';
import Icon from "react-crud-icons";
import "../../node_modules/react-crud-icons/dist/css/react-crud-icons.css";
import moment from 'moment';
import {counterDate} from './commonCode';
function SearchPlatFormMaster(){
    let currentUserDetails = JSON.parse(localStorage.getItem("userInfo"));
    let userID = currentUserDetails[0];
    var count = 1
    const [allRequestCount,setAllRequestCount] = useState([])
    const [openRequestCount,setOpenRequestCount] = useState([])
    const [closedRequestCount,setClosedRequestCount] = useState([])
    const [onHoldRequestCount,setOnHoldRequestCount] = useState([])
    const [cancellledRequestCount,setCancelledRequestCount] = useState([])

    const [allSearchPlatForm,setAllSearchPlatForm] = useState([])

    useEffect(() => {
        apiData();
        fetch(apiUrl+"searchPlatform").then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(responseAllStatus => setAllSearchPlatForm(responseAllStatus))  
        
     },[])
    
     const apiData = async e => {

         
        let result = await axios.get(apiUrl+'openRequestCount/',{
             params:{
                // 'countDate':countDate,
                 'userID':userID
             },
         })
         setOpenRequestCount(result.data);
        
         
         result = await axios.get(apiUrl+'closedRequestCount/',{
             params:{
                // 'countDate':countDate,
                 'userID':userID
             },
         })
         setClosedRequestCount(result.data);
 
         result = await axios.get(apiUrl+'onHoldRequestCount/',{
             params:{
                // 'countDate':countDate,
                 'userID':userID
             },
         })
         setOnHoldRequestCount(result.data);
 
         result = await axios.get(apiUrl+'allRequestCount/',{
             params:{
               //  'countDate':countDate,
                 'userID':userID
             },
         })
         setAllRequestCount(result.data);
         result = await axios.get(apiUrl+'cancelledRequestCount/',{
             params:{
                // 'countDate':countDate,
                 'userID':userID
             },
         })
         setCancelledRequestCount(result.data);
      }

     async function  deleteSearchPlatForm(id)
     {
          await axios.delete(apiUrl+`searchPlatformDelete/${id}`);
          var  newAllSearchPlatForm= allSearchPlatForm.filter((item) => {
              return item.id !== id;
          })
          setAllSearchPlatForm(newAllSearchPlatForm);       
      }

    return(

        <div id="wrapper">
            <Sidebar/> 
            <div id="content-wrapper" class="d-flex flex-column">
                <div id="content"> 
                <Header/> 
                <>

 
  <div className="container-fluid">
 
        <div>
            <Link to={`/searchPlatFormMasterForm`}><Icon name = "add" tooltip = "Add" theme = "light" size = "medium"></Icon>
            </Link> 
           
            </div>

        <div className="card shadow mb-4">
           
            


            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Search Platform List</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                      
                        <tbody>
                        {
                          
                          allSearchPlatForm?.map((item, i) => (
                                <tr key={i}>
                                     
                                 <td>{count+i}</td>
                               
                                  <td>{item.search_name}</td>
                                  <td>
                                  <Link to={`/editSearchPlatFormMaster/${item.id}`}><Icon name = "edit" tooltip = "Edit" theme = "light" size = "medium">  </Icon> </Link>
                                    
                                      <Icon name = "delete" tooltip = "Delete" theme = "light" size = "medium" onClick={() => deleteSearchPlatForm(item.id)}> </Icon>
                                  </td>
                                </tr>
                               
                              ))}
                        
                        </tbody>
                    </table>
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

export default SearchPlatFormMaster;