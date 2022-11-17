import React,{useEffect,useState} from 'react'
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from './sidebar';
import axios from 'axios';
import {apiUrl}  from '../constant/constant';
import { Link } from 'react-router-dom';
import Icon from "react-crud-icons";
import "../../node_modules/react-crud-icons/dist/css/react-crud-icons.css";
import {counterDate} from './commonCode';
import moment from 'moment';
function StatusMaster(){
    let currentUserDetails = JSON.parse(localStorage.getItem("userInfo"));
    let userID = currentUserDetails[0];
    var count = 1
    const [allRequestCount,setAllRequestCount] = useState([])
    const [openRequestCount,setOpenRequestCount] = useState([])
    const [closedRequestCount,setClosedRequestCount] = useState([])
    const [onHoldRequestCount,setOnHoldRequestCount] = useState([])
    const [cancellledRequestCount,setCancelledRequestCount] = useState([])

    const [allStatus,setAllStatus] = useState([])

    useEffect(() => {
        apiData();
        fetch(apiUrl+"status").then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(responseAllStatus => setAllStatus(responseAllStatus))  
        
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

     async function  deleteStatus(id)
     {
          await axios.delete(apiUrl+`statusDelete/${id}`);
          var  newAllStatus= allStatus.filter((item) => {
              return item.id !== id;
          })
          setAllStatus(newAllStatus);       
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
            <Link to={`/statusMasterForm`}><Icon name = "add" tooltip = "Add" theme = "light" size = "medium"></Icon>
            </Link> 
            </div>
            
       
 
        <div className="card shadow mb-4">
           
            


            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Status List</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                      
                        <tbody>
                        {
                          
                            allStatus?.map((item, i) => (
                                <tr key={i}>
                                     
                                 <td>{count+i}</td>
                               
                                  <td>{item.type}</td>
                                  <td>
                                  <Link to={`/editStatusMaster/${item.id}`}><Icon name = "edit" tooltip = "Edit" theme = "light" size = "medium">  </Icon>   </Link>
                                    
                                      <Icon name = "delete" tooltip = "Delete" theme = "light" size = "medium" onClick={() => deleteStatus(item.id)}>
                                        
                                          </Icon>
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

export default StatusMaster;