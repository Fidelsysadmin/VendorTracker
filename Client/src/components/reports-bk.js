import React,{useEffect,useState} from 'react'
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from './sidebar';
import axios from 'axios';
import {apiUrl, baseUrl}  from '../constant/constant';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";
import Icon from "react-crud-icons";
import "../../node_modules/react-crud-icons/dist/css/react-crud-icons.css";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import date from 'date-and-time';
function Reports(){
    var counter= 1;
    var arMonth = [];
    var arMonthNumber = [];
    var monthValue;
    var yearValue;
    var monthNum;
    let arData = new Array();
    const [monthValues,setMonthValues] = useState([])
    const [monthNumber,setMonthNumber] = useState([])
    const [month,setMonth] = useState()
    const [reportData,setReportData] = useState([])
    const [userDetails,setUserDetails] = useState([])
    const [languageList,setLanguageList] = useState([])
    const [statusList,setStatusList] = useState([])
    const [serviceTypeList, setServiceTypeList] = useState([])
    const [reportDownload,setReportDownload] = useState([])
    const [fromDate,setFromDate] = useState();
    const [toDate,setToDate] = useState()
    const [errMessage,setErrMessage] = useState()
    const fromDateChange = date => setFromDate({fromDate: date})
    const toDateChange = date => setToDate({toDate: date})
     
    useEffect(() => {
         
        var theMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        var now = new Date();
       
        for (var i =0; i < 12; i++) {
          var future = new Date(now.getFullYear(), now.getMonth() - i, 1);
          var month = theMonths[future.getMonth()];
          var year = future.getFullYear();
          var value = month+' '+year;
          var monthNumber = future.getMonth();
          arMonth.push(value);
          arMonthNumber[monthNumber+1] = value;
        }
        setMonthValues(arMonth)
        setMonthNumber(arMonthNumber)

        apiData();
        

     },[])
    
     const apiData = async e =>{
        let result = await axios.get(baseUrl+`all_user_list`);
        setUserDetails(result.data.Output);
        
        result = await axios.get(apiUrl+`languageList`);
        setLanguageList(result.data);

         result = await axios.get(apiUrl+`serviceTypes`);
        setServiceTypeList(result.data);

         result = await axios.get(apiUrl+`status`);
        setStatusList(result.data);
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
    
     const showeport = async e =>{
        
        if(month && fromDate && toDate)
        {
            setErrMessage('Select Month OR Date Range');
        } else if(month)
        {
            setErrMessage('')
        monthNum = monthNumber.indexOf(month);
        monthNum = ''+monthNum
        if(monthNum.length == 1)
        {
            monthNum = '0'+monthNum;
           
        }
        var string = month.split(" ")
        yearValue = string[1];
        var dateValue = yearValue+'-'+monthNum;
        
        const result = await axios.get(apiUrl+`report/${dateValue}`);
        setReportData(result.data);

        const result1 = await axios.get(apiUrl+`report/${dateValue}`);
        setReportDownload(result1.data)
        } else if (fromDate && toDate)
        {
            setErrMessage('')
            var fromDateFormat = new Date(fromDate.fromDate);
            fromDateFormat = moment(fromDateFormat).format('YYYY-MM-DD h:mm:s');
            var toDateFormat = new Date(toDate.toDate);
            toDateFormat = moment(toDateFormat).format('YYYY-MM-DD h:mm:s');
            const result = await axios.get(apiUrl+'dateRangeReport/',{
                params:{
                    'fromDate':fromDateFormat,
                    'toDate':toDateFormat
                },
            })
            setReportData(result.data);
            
        }
        
     }
     
    const clearReport = () =>{
        window.location.href = "/reports";       
    }

     for (let index = 0; index < reportDownload.length; index++) {
         
         if(reportDownload[index]['request_from'] !== 'undefined')
         {
            let requestFrom =  reportDownload[index]['request_from']
            let coOrdinator = reportDownload[index]['co_ordinator']
            let responseBy = reportDownload[index]['response_by']
            let requestDate = reportDownload[index]['dor_time']
         reportDownload[index]['request_from'] = arUser[requestFrom]  
         reportDownload[index]['co_ordinator'] = arUser[coOrdinator]  
         reportDownload[index]['response_by'] = arUser[responseBy]  
         reportDownload[index]['dor_time'] = moment(requestDate).format('YYYY-MM-DD h:mm'); 
         arData.push(JSON.stringify(reportDownload[index]))
       
         }
         
     }
  
    const headers = [
        {label:'ID',key:'id'},
        {label:'Request From',key:'request_from'},
        {label:'Date of Request',key:'dor_time'},
        {label:'E-code',key:'e_code'},
        {label:'Co-ordinator',key:'co_ordinator'},
        {label:'Source Langauge',key:'source_language'},
        {label:'Target Language',key:'target_language'},
        {label:'Service Type',key:'service_type'},
        {label:'Particulars',key:'particulars'},
        {label:'Response By',key:'response_by'},
        {label:'Status',key:'status'}

    ];
    // const csvData = arData;
    // console.log(myArray);
    // console.log(JSON.parse(arData[0]))
    let lastArr = []
    for (let index = 0; index < arData.length; index++) {

        lastArr.push(JSON.parse(arData[index]))

    }
   
    const csvData = {
        filename:'RequestReport.csv',
        headers:headers,
        data:reportData
    }; 
    
    return(
       
        <div id="wrapper">
            <Sidebar/> 
            <div id="content-wrapper" class="d-flex flex-column">
                <div id="content"> 
                <Header/> 
                <>

  <div className="container-fluid">
 
        <div className="card shadow mb-4">
           
        <form className="user" style={{margin:"30px 30px"}} >                            
                                                
            <div className="row" style={{width:"70%"}}>
                                              
           <div className="col">
           <label for="exampleFormControlTextarea1">Select Month</label>
        
           <select class="form-control" id="month" name="month" onChange={(e) => setMonth(e.target.value) }  >
                                        <option></option>
                                        {
                                            
                                            monthValues.map((item, i) => (
                                            
                                          <option value={item.key}>{item}</option>                                             
                                        ))                                      
                                        }
                               
                               
                               </select>
            
        </div>

        <div className="col">
                                        <label>From Date</label>
                                        
                                        <Datetime   id="fromDate" name="fromDate" aria-describedby="emailHelp"                        onChange={fromDateChange} />
                                          
                                    </div>

                                    <div className="col">
                                        <label>To Date</label>
                                        
                                        <Datetime id="toDate" name="toDate" aria-describedby="emailHelp" onChange={toDateChange}/>
                                        
                                    </div>


       </div>
       <p style={{color:'red'}}>{errMessage}</p>   
        <br/>
        <button className="btn btn-primary btn-user btn-block" onClick={e => showeport()}  type="button" style={{width:"12%",height:"40px",float:"left"}}> 
           Show Report
        </button>

            <button className="btn btn-primary btn-user btn-block" onClick={e => clearReport()}  type="button" style={{width:"12%",height:"40px",float:"left",marginLeft:"100px"}}> 
           Reset
        </button>

        <label id="message"> </label>
       <hr style={{marginTop:"30px"}}/>
     </form>
     { reportDownload && reportDownload.length > 0 && (  
         
        <CSVLink {...csvData} > <Icon name = "download" tooltip = "Download" theme = "light" size = "large"></Icon></CSVLink>
        
     ) }
     
          
    
     
     
      

            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Request List</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date of Request</th>
                                <th>Request From</th>
                                <th>E-code</th>
                                <th>Co-ordinator</th>
                                <th>Source</th>
                                <th>Target</th>
                                <th>Service Type</th>
                                <th>Particulars</th>
                                <th>Response By</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                            <th>ID</th>
                            <th>Date of Request</th>
                                <th>Request From</th>
                                <th>E-code</th>
                                <th>Co-ordinator</th>
                                <th>Source</th>
                                <th>Target</th>
                                <th>Service Type</th>
                                <th>Particulars</th>
                                <th>Response By</th>
                                <th>Status</th>
                            </tr>
                        </tfoot>
                        <tbody>
                        {
                          
                            reportData?.map((item, i) => (
                                <tr key={i}>
                                 {/* <td> {i+1}</td>                
                                <td>{moment(item.dor_time).format("DD-MM-YYYY hh:mm:ss")}</td>
                                 <td>{arUser[item.request_from]}</td>
                                 <td>{item.e_code}</td>                              
                                 <td>{arUser[item.co_ordinator]}</td>
                                 <td>{arLanguage[item.source_language]}</td>
                                 <td>{arLanguage[item.target_language]}</td>
                                 <td>{arServiceType[item.service_type]}</td>
                                 <td>{item.particulars}</td>
                                 <td>{arUser[item.response_by]}</td>
                                 <td>{arStatus[item.status]}</td> */}
                                 
                                 <td> {i+1}</td>                
                                <td>{moment(item.dor_time).format("DD-MM-YYYY hh:mm:ss")}</td>
                                 <td>{arUser[item.request_from]}</td>
                                 <td>{item.e_code}</td>                              
                                 <td>{arUser[item.co_ordinator]}</td>
                                 <td>{item.source_language}</td>
                                 <td>{item.target_language}</td>
                                 <td>{item.service_type}</td>
                                 <td>{item.particulars}</td>
                                 <td>{arUser[item.response_by]}</td>
                                 <td>{item.status}</td>

                               </tr>
                                   
                             ))
                            }
                        
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


export default Reports;