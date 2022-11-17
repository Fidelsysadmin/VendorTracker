import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import Sidebar from "./sidebar";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import {apiUrl,baseUrl}  from '../constant/constant';
import axios from 'axios';
import moment from 'moment';
import Icon from "react-crud-icons";
import "../../node_modules/react-crud-icons/dist/css/react-crud-icons.css";
import "./content.css";
import {counterDate,arRequestStatus} from './commonCode';
import swal from 'sweetalert';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator'; 
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import _ from 'lodash';
import RequestTabs from './requestTabs';
const qs = require('qs')
function DelayRequest() {
    let counter = 1;
    let records;
    let currentUserDetails = JSON.parse(localStorage.getItem("userInfo"));
    let userID = currentUserDetails[0];
    let userRole = currentUserDetails[1];
    let arUserids = new Array();
    let currentDate = moment(counterDate).format("DD-MM-YYYY hh:mm a");
    let arCounter = new Array();
    const [userDetails,setUserDetails] = useState([])
    const [languageList,setLanguageList] = useState([])
    const [allDelayRequest,setAllDelayRequest] = useState([])
    const [statusList,setStatusList] = useState([])
    const [serviceTypeList, setServiceTypeList] = useState([])
    const [arData,setArData] = useState([])
   
    const columns = [
        {dataField:'id', text: 'ID',sort:true},
        { dataField: "dorDate", text: "Date of Request", sort: true },
        {dataField:'requestFrom', text: 'Request From',sort:true},
        {dataField:'coOrdinator', text: 'co-Ordinator',sort:true},
        {dataField:'sourceLang', text: 'Source',sort:true},
        {dataField:'targetLang', text: 'Target',sort:true},
        {dataField:'serviceType', text: 'Service Type',sort:true},
        {dataField:'status', text: 'Status',sort:true},
        
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
          onPageChange: function (page, sizePerPage) {
          console.log('page', page);
          console.log('sizePerPage', sizePerPage);
        },
        onSizePerPageChange: function (page, sizePerPage) {
          console.log('page', page);
          console.log('sizePerPage', sizePerPage);
        }      
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
       
        var countDate = moment(counterDate).format('YYYY-MM');
        let result = await axios.get(baseUrl+`all_user_list`);
        setUserDetails(result.data.Output);
        if(userRole === 'VM' || userRole === 'VC')
        {
            userID = '01';
        } 
         result = await axios.get(apiUrl+`serviceTypes`);
        setServiceTypeList(result.data);

        result = await axios.get(apiUrl+`languageList`);
        setLanguageList(result.data);

        result = await axios.get(apiUrl+`status`);
        setStatusList(result.data);
        
         result = await axios.get(apiUrl + "delayRequest/", {
      params: {
        userID: userID,
      },
    });
    setAllDelayRequest(result.data);
     }  
     
     var arLanguage = []
     languageList.map((item,index) => {
           arLanguage[item.value] = item.key
     })

     var arUser = []
     userDetails.map((item,index) =>{
         arUser[item.id] = item.name
     })

     var arStatus = []
     statusList.map((item,index) => {
         arStatus[item.id] = item.type
     })
     var arServiceType = []
     serviceTypeList.map((item,index) => {
         arServiceType[item.key] = item.value
     })
     
     allDelayRequest.map((item, i) => {
       let arCurrent = {'dorDate': '','requestFrom':'','coOrdinator':'','sourceLang':'','targetLang':'','serviceType':'','status':''}
       let targetLanguage = item.target_language;
       let sourceLanguage = item.source_language;
       let services = item.service_type;
       let arTargetLanguage = new Array;
       let arSourceLanguage = new Array;
       let arServices = new Array;
        var arTargetLang = targetLanguage.split(',');
        var arsourceLang = sourceLanguage.split(',');
        var arServicesType = services.split(',');
       for (let index = 0; index < arTargetLang.length; index++) {
        var currentValue = arLanguage[arTargetLang[index]]
        arTargetLanguage.push(currentValue);
       }

        for (let index = 0; index < arsourceLang.length; index++) {
        var currentValue = arLanguage[arsourceLang[index]]
        arSourceLanguage.push(currentValue);
       }

       for (let index = 0; index < arServicesType.length; index++) {
        var currentValue = arServiceType[arServicesType[index]]
        arServices.push(currentValue);
       }

       let strTargetLanguage =  arTargetLanguage.toString();
       let strSourceLanguage =  arSourceLanguage.toString();
       let strServices =  arServices.toString();
       if (item.created_by == userID && ( userRole === 'PM' || userRole === 'PC' || userRole === 'Sales'))
       {   
        arCurrent.dorDate =  moment(item.dor_time).format("DD-MM-YYYY hh:mm a")   
        arCurrent.doc =  moment(item.date_of_closure).format("DD-MM-YYYY hh:mm a")   
        arCurrent.doc_vmpm =   item.doc_vmpm                                       
        arCurrent.requestFrom =  arUser[item.request_from]
        arCurrent.coOrdinator =  arUser[item.co_ordinator]
        arCurrent.sourceLang = strSourceLanguage
        arCurrent.targetLang = strTargetLanguage
        arCurrent.serviceType = strServices
        arCurrent.status =  arStatus[item.status]   
        arCurrent.id = counter
        arData.push(arCurrent) 
        counter = counter + 1                                             
       } else if ( userRole === 'VM' || userRole === 'VC')
       {
            arCurrent.dorDate =  moment(item.dor_time).format("DD-MM-YYYY hh:mm a")  
            arCurrent.requestFrom =  arUser[item.request_from]
            arCurrent.coOrdinator =  arUser[item.co_ordinator]
            arCurrent.sourceLang = strSourceLanguage
            arCurrent.targetLang = strTargetLanguage
            arCurrent.serviceType = strServices
            arCurrent.status =  arStatus[item.status]  
            arCurrent.id = counter   
            arData.push(arCurrent) 
            counter = counter + 1
         }
            
        }
    )
     
    const seen = new Set();
     records = arData.filter(el => {
        const duplicate = seen.has(el.id);
        seen.add(el.id);
        return !duplicate;
      });

   
     
       
     return (
         <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <Header />
          <>
            <div style={{ marginLeft: "10px" }}></div>
            <div className="container-fluid">
              <RequestTabs />
              <div>
                <Link to={`/addRequest`}>
                  <button type="button" className="btn btn-primary">
                    Create Request
                  </button>
                </Link>
              </div>

              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Closed Requests
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <ToolkitProvider
                      bootstrap4
                      keyField="id"
                      data={records}
                      columns={columns}
                      search
                    >
                      {(props) => (
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
                      )}
                    </ToolkitProvider>
                  </div>
                </div>
              </div>
            </div>
          </>
          <Footer />
        </div>
      </div>
    </div>
             
       
    )

}
export default DelayRequest
