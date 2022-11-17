import React,{useEffect,useState} from 'react'
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
import {apiUrl,baseUrl}  from '../constant/constant';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {counterDate} from './commonCode';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator'; 
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import _ from 'lodash';
import swal from 'sweetalert';
import "../../node_modules/react-crud-icons/dist/css/react-crud-icons.css";
import Icon from "react-crud-icons";
function UserManagement(){
    let counter = 1;
    let currentUserDetails = JSON.parse(localStorage.getItem("userInfo"));
    let userID = currentUserDetails[0];
    let userRole = currentUserDetails[1];
    let records;
    const [allRequestCount,setAllRequestCount] = useState([])
    const [openRequestCount,setOpenRequestCount] = useState([])
    const [closedRequestCount,setClosedRequestCount] = useState([])
    const [onHoldRequestCount,setOnHoldRequestCount] = useState([])
    const [cancellledRequestCount,setCancelledRequestCount] = useState([])
    const [allOpenRequest,setAllOpenRequest] = useState([])
    const [userDetails,setUserDetails] = useState([])
    const [languageList,setLanguageList] = useState([])
    const [statusList,setStatusList] = useState([])
    const [serviceTypeList, setServiceTypeList] = useState([])
    const [arData,setArData] = useState([])
   
    const columns = [
        {dataField:'id', text: 'ID',sort:true},
        {dataField:'name', text: 'Name',sort:true},
        {dataField:'role', text: 'Role',sort:true},
        {dataField:'email', text: 'Email',sort:true},
        {dataField:'delete', text: 'delete'},
    ]
    const pagination = paginationFactory({
        page: 2,
        sizePerPage: 5,
        lastPageText: '>>',
        firstPageText: '<<',
        nextPageText: '>',
        prePageText: '<',
        showTotal: true,
        alwaysShowAllBtns: true,       
      });
    
      const { SearchBar, ClearSearchButton } = Search;

      const defaultSorted = [{
        dataField: 'id',
        order: 'asc'
      }];

    useEffect(() => {
        apiData();
     },[])
     
     const apiData = async e =>{
        
        fetch(baseUrl+"all_user_list").then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(responseGetUser => setUserDetails(responseGetUser.Output))  

        
     }

        async function deleteUser(id)
     {
     swal({
         title: "Are you sure Delete User?",
         icon: "warning",
         buttons: true,
         dangerMode: true,
       })
       .then((willDelete) => {
         if (willDelete) {
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                     user_id : id
                })
            };
            fetch(baseUrl+'delete_user/', requestOptions)
            .then(responseAllStatus => console.log(responseAllStatus)) 
             window.location.href = "/userManagement";

         } 
       });

         
     }
     userDetails.map((item, i) => {
       let arCurrent = {'id': '','name':'','role':'','email':''}
      
        arCurrent.id = counter      
        arCurrent.name = item.name
        arCurrent.role = item.role
        arCurrent.email = item.email  
        arCurrent.delete =  <Icon name = "delete" tooltip = "Delete" theme = "light" size = "small" onClick={() => deleteUser(item.id)}>  </Icon>                
        arData.push(arCurrent)  
        counter = counter + 1                                   
          
     }
    )
    records = Array.from(new Set(arData)); 
    

    return(

        <div id="wrapper">
            <Sidebar/> 
            <div id="content-wrapper" class="d-flex flex-column">
                <div id="content"> 
                <Header/> 
                <>

<div style={{marginLeft:"10px"}}> 
     
</div>
  <div className="container-fluid">
 
        <div className="card shadow mb-4">        
          
            <div className="card-body">
                <div className="table-responsive">

                <ToolkitProvider bootstrap4 keyField='id' data={records} columns={columns}  defaultSorted={defaultSorted} search>
             {
          props => (
            <div>
              
              <SearchBar {...props.searchProps} />
              <ClearSearchButton {...props.searchProps} />

              <hr />
              <BootstrapTable
                 defaultSorted={defaultSorted} 
                pagination={pagination}
                {...props.baseProps}
                
              />
                
            </div>
          )
        }
      </ToolkitProvider>
                
     
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

export default UserManagement;