import React, {useState,useEffect} from "react";
import { baseUrl,apiUrl } from "../constant/constant";
import { Link,useParams,useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from "axios";
import moment from 'moment';
import { subSeconds } from "date-fns";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import date from 'date-and-time';

function EditRequest(){
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let role = userInfo[1]
    let navigate = useNavigate();
    const { id } = useParams();
    const [requestData,setRequestData] = useState({
        dor_time: "",
        request_from:"",
        co_ordinator:"",
        source_language:"",
        target_language:"",
        service_type:"",
        particulars:"",
        status:"",
        date_of_closure:"",
        doc_vmpm:"",
        userRole:"",

    })


    const {dor_time,request_from,co_ordinator,source_language,target_language,service_type,particulars,status,date_of_closure,doc_vmpm,userRole} = requestData;
    const onInputChange = e => {
          setRequestData({...requestData,[e.target.name] : e.target.value});
  
    };
    
    const onDateChange = date => setRequestData({...requestData, dor_time: date})
    const onClosureDateChange = date => setRequestData({...requestData, date_of_closure: date})
    const onDocVMPMChange = date => setRequestData({...requestData, doc_vmpm: date})
    const handleSelect = function(selectedItems) {
        const flavors = [];
        for (let i=0; i<selectedItems.length; i++) {
            flavors.push(selectedItems[i].value);
        }
        requestData.target_language = flavors
    }

        const sourceSelect = function(selectedItems) {
        const flavors = [];
        for (let i=0; i<selectedItems.length; i++) {
            flavors.push(selectedItems[i].value);
        }
        requestData.source_language = flavors
    }

    const serviceSelect = function(selectedItems) {
        const flavors = [];
        for (let i=0; i<selectedItems.length; i++) {
            flavors.push(selectedItems[i].value);
        }
        requestData.service_type = flavors
    }

    useEffect(()=> {
        loadRequestForm();
    },[])

  

    const [userList,setUserList] = useState([])
    const [getAllMasters,setGetAllMasters] = useState([])
    const [languageList,setLanguageList] = useState([])
    const [statuslist,setStatuslist] = useState([])
    const [serviceTypelist, setServiceTypeList] = useState([])
    const [requestDateErr,setRequestDateErr] = useState([])
    const [requestFromErr,setRequestFromErr] = useState([])
    const [coordinatorErr,setCoordinatorErr] = useState([])
    const [sourceErr,setSourceErr] = useState([])
    const [targetErr,setTargetErr] = useState([])
    const [serviceTypeErr,setServiceTypeErr] = useState([])
    const [particularsErr,setParticularsErr] = useState([])
    const [statusErr,setStatusErr] = useState([])
    const [requestDOCErr,setRequestDOCErr] = useState([])
    const [dOCVMPMErr,setDOCVMPMErr] = useState([])

    const loadRequestForm = async e => {
      const result = await axios.get(apiUrl+`request/${id}`);
      setRequestData(result.data);
    
      const resultUser = await axios.get(baseUrl+`all_user_list/`);
      setUserList(resultUser.data.Output);
      
      const resultAllMaster = await axios.get(apiUrl+"getAllMasters");
      setGetAllMasters(resultAllMaster.data);

      const resultLanguageList = await axios.get(apiUrl+"languageList/");
      setLanguageList(resultLanguageList.data);
        
      const resultStatus = await axios.get(apiUrl+"status/");
      setStatuslist(resultStatus.data);

      const resultServiceTypeMaster = await axios.get(apiUrl+"serviceTypes");
      setServiceTypeList(resultServiceTypeMaster.data);      
    }
  
    const onSubmit = async e => {
        e.preventDefault();
        const isValid = formValidation();
        var requestDateTime = moment(requestData.dor_time).format("YYYY-MM-DD hh:mm:ss")
        requestDateTime = requestDateTime.split("-");
        var requestDate = requestDateTime[2].split(" ");
        var requestDateHour = new Date(requestData.dor_time).getHours() 
        var requestDateMinutes = new Date(requestData.dor_time).getMinutes() 
        var requestDateTime = requestDateTime[0]+'-'+requestDateTime[1]+'-'+requestDate[0]+' '+requestDateHour+':'+requestDateMinutes
        requestData.dor_time =  requestDateTime
         
        var dateOfClosure =  moment(requestData.date_of_closure).format("YYYY-MM-DD hh:mm:ss")
        dateOfClosure = dateOfClosure.split("-");
        var closureDate = dateOfClosure[2].split(" ");
        var closureDateHour = new Date(requestData.date_of_closure).getHours() 
        var closureDateMinutes = new Date(requestData.date_of_closure).getMinutes() 
        var dDateOfClosure = dateOfClosure[0]+'-'+dateOfClosure[1]+'-'+closureDate[0]+' '+closureDateHour+':'+closureDateMinutes
        requestData.date_of_closure =  dDateOfClosure
        if(requestData.doc_vmpm)
        {
            var docVMPM =  moment(requestData.doc_vmpm).format("YYYY-MM-DD hh:mm:ss")
            docVMPM = docVMPM.split("-");
            var docVMPMDate = docVMPM[2].split(" ");
            var docVMPMHour = new Date(requestData.doc_vmpm).getHours() 
            var docVMPMMinutes = new Date(requestData.doc_vmpm).getMinutes() 
            var dDocVMPM = docVMPM[0]+'-'+docVMPM[1]+'-'+docVMPMDate[0]+' '+docVMPMHour+':'+docVMPMMinutes
            requestData.doc_vmpm =  dDocVMPM
        }
       
        requestData.userRole = role
        
        if(isValid == true)
        {     
            await axios.put(apiUrl+`requestUpdate/${id}`,requestData);
            navigate("/dashboard");            
        }
    }
    
    let sourceTargetList = getAllMasters.sourceTargeteMaster;
    let serviceTypeList = getAllMasters.serviceMaster;
    let statusList = getAllMasters.stateMaster;
    let searchPlatformList = getAllMasters.searchPlatformMaster;
    var arLanguage = []
    languageList.map((item,index) => {
          arLanguage[item.value] = item.key
    })

    var arUser = []
    userList.map((item,index) =>{
        arUser[item.id] = item.name
    })
    var arStatus = []
    statuslist.map((item,index) => {
         arStatus[item.id] = item.type
     })
     var arServiceType = []
     serviceTypelist.map((item,index) => {
         arServiceType[item.key] = item.value
     })
     

    const formValidation = () =>{
        let isValidRequestDate = true;
        let isValidRequestFrom = true;
        let isValidCoordinator = true;
        let isValidSource = true;
        let isValidTarget = true;
        let isValidServieType = true;
        let isValidParticulars = true;
        let isValidStatus = true;
        let isValid =true;
        let isValidRequestClosureDate = true;
        let isValidDOCVMPM = true;

        if(status === '1' && doc_vmpm === null)
        {
            setDOCVMPMErr('Select the DOC for VM/PM')
            isValidDOCVMPM = false
        }
        if(dor_time == '')
        {
            setRequestDateErr('Select the Request Date');
            isValidRequestDate = false;
        } else
        {
            setRequestDateErr('');
            isValidRequestDate = true;
        }

        if(date_of_closure == '')
        {
            setRequestDOCErr('Select the Request Closure Date');
            isValidRequestClosureDate = false;
        } else
        {
            setRequestDOCErr('');
            isValidRequestClosureDate = true;
        }

        if(request_from == '')
        {
            setRequestFromErr('Select the Request From');
            isValidRequestFrom = false;
        } else
        {
            setRequestFromErr('');
            isValidRequestFrom = true;
        }

        if(co_ordinator == '')
        {
            setCoordinatorErr('Select the Co-ordinator');
            isValidCoordinator = false;
        } else
        {
            setCoordinatorErr('');
            isValidCoordinator = true;
        }


        if(source_language == '')
        {
            setSourceErr('Select the Source');
            isValidSource = false;
        } else
        {
            setSourceErr('');
            isValidSource = true;
        }

        if(target_language == '')
        {
            setTargetErr('Select the Target');
            isValidTarget = false;
        } else
        {
            setTargetErr('');
            isValidTarget = true;
        }

        if(service_type == '')
        {
            setServiceTypeErr('Select the Service Type');
            isValidServieType = false;
        } else
        {
            setServiceTypeErr('');
            isValidServieType = true;
        }


        if(particulars == '')
        {
            setParticularsErr('Enter the Particulars');
            isValidParticulars = false;
        } else
        {
            setParticularsErr('');
            isValidParticulars = true;
        }
        
        if(status == '')
        {
            setStatusErr('Select the Status');
            isValidStatus = false;
        } else
        {
            setStatusErr('');
            isValidStatus = true;
        }

        if(isValidRequestDate == true && isValidRequestFrom == true && isValidCoordinator == true && isValidSource == true && isValidTarget == true && isValidServieType == true && isValidParticulars == true && isValidStatus == true &&    isValidRequestClosureDate == true && isValidDOCVMPM == true)
        {
            isValid = true;
        }else
        {
            isValid = false;
        }

        return isValid;
    } 
 console.log(requestData.service_type);
    return( 
      
        <div id="wrapper">
        <Sidebar/> 
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content"> 
            <Header/> 
           <div style={{width:"500px",marginLeft:"270px"}}>

<form className="user" onSubmit = { e => onSubmit(e)} >
 
                                    <div className="row">
                                    <div className="col">
                                        <label>DOR and time</label>
                                        
                                        <Datetime   id="dor_time" name="dor_time" aria-describedby="emailHelp" onChange={ date => onDateChange(date)}  
                                        value = {moment(requestData.dor_time).format("MM/DD/YYYY hh:mm a")}
                                        selected={requestData.dor_time}                                 
                                         />
                                         <p style={{color:'red'}}>{requestDateErr}</p>
                                    </div>

                                    <div className="col">                                    
                                    <label>Date of Closure</label>
                                    <Datetime   id="date_of_closure" name="date_of_closure" aria-describedby="emailHelp" onChange={ date => onClosureDateChange(date)}  value = {moment(requestData.date_of_closure).format("MM/DD/YYYY hh:mm a")} selected={requestData.date_of_closure} 
                                     
                                      />                                   

                                        <p style={{color:'red'}}>{requestDOCErr}</p>
                                </div>
                                </div>
                                { userInfo && (userInfo[1] === 'VM' || userInfo[1] === 'VC') && requestData.doc_vmpm !== null  &&(  
                                <div className="row">
                                    <div className="col">
                                        <label>DOC for VM/VC</label>
                                        
                                        <Datetime   id="doc_vmpm" name="doc_vmpm" aria-describedby="emailHelp" onChange={ date => onDocVMPMChange(date)}  
                                        value = {moment(requestData.doc_vmpm).format("MM/DD/YYYY hh:mm a")}
                                        selected={requestData.doc_vmpm}                                 
                                         />
                                         <p style={{color:'red'}}>{dOCVMPMErr}</p>
                                    </div>

                                    <div className="col">
                                        
                                    </div>
                                  
                                </div>
                                 )
                                } 

                        { userInfo && (userInfo[1] === 'VM' || userInfo[1] === 'VC') && requestData.doc_vmpm === null  &&(  
                                <div className="row">
                                    <div className="col">
                                        <label>DOC for VM/VC</label>
                                        
                                        <Datetime   id="doc_vmpm" name="doc_vmpm" aria-describedby="emailHelp" onChange={ date => onDocVMPMChange(date)}                                     
                                        selected={requestData.doc_vmpm}                                 
                                         />
                                         <p style={{color:'red'}}>{dOCVMPMErr}</p>
                                    </div>

                                    <div className="col">
                                        
                                    </div>
                                  
                                </div>
                                 )
                                } 
                                <div className="row">
                                    <div className="col"> 
                                    <label for="exampleFormControlSelect1">Request from</label>
                                  
                                    <select class="form-control" id="request_from" onChange={e => onInputChange(e)} name="request_from" >
                                        <option value={requestData.request_from} selected>{arUser[requestData.request_from]}</option>
                                        <option></option>
                                         {
                                         userList?.map((item, i) => (
                                            
                                          <option value={item.id}>{item.name}</option>                                             
                                        ))                                      
                                        }
                               
                               </select>
                               <p style={{color:'red'}}>{requestFromErr}</p>
                                    </div>
                               
                               
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Co-ordinator</label>
                                    <select class="form-control" id="co_ordinator" onChange={e => onInputChange(e)} name="co_ordinator" >
                                    <option value={requestData.co_ordinator} selected>{arUser[requestData.co_ordinator]}</option>
                                    <option></option>
                                    {
                                         userList?.map((item, i) => (
                                            
                                          <option value={item.id}>{item.name}</option>    
                                         
                                        ))                                      
                                    }
                                    </select>
                                    <p style={{color:'red'}}>{coordinatorErr}</p>
                                </div>
                                    </div>
                                <div className="row">
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Source</label>
                                    <select class="form-control" id="source_language" name="source_language" multiple={true}  onChange={(e)=> {sourceSelect(e.target.selectedOptions)}} >
                                    
                                    <option></option>
                                    {                                        
                                        sourceTargetList?.map((item, i) => (    
                                            requestData.source_language.indexOf(item.value) > -1 ?
                                           (
                                           <option value={item.value} selected>{item.key}</option>
                                           ) :  <option value={item.value}>{item.key}</option>
                                         
                                        ))
                                    };   
                                    </select>
                                    <p style={{color:'red'}}>{sourceErr}</p>
                                  </div>
                               
                              
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Target</label>
                                    <select class="form-control" id="target_language" name="target_language"  multiple={true}  onChange={(e)=> {handleSelect(e.target.selectedOptions)}}  >
                                  <option></option>
                                    {
                                        sourceTargetList?.map((item, i) => (    
                                            requestData.target_language.indexOf(item.value) > -1 ?
                                           (
                                           <option value={item.value} selected>{item.key}</option>
                                           ) :  <option value={item.value}>{item.key}</option>
                                         
                                        ))
                                      
                                    }   
                                    </select>

                                    <p style={{color:'red'}}>{targetErr}</p>
                                </div>
                                </div>        
                                <div className="row">
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Service Type</label>
                                    
                                    <select class="form-control" id="service_type" name="service_type"  multiple={true}  onChange={(e)=> {serviceSelect(e.target.selectedOptions)}} >
                                    
                                    <option></option>
                                    {
                                         
                                         serviceTypelist?.map((item, i) => (    
                                            requestData.service_type.indexOf(item.key) > -1 ?
                                           (
                                           <option value={item.key} selected>{item.value}</option>
                                           ) :  <option value={item.key}>{item.value}</option>
                                         
                                        ))
                                      
                                        }   
                                    </select>
                                    <p style={{color:'red'}}>{serviceTypeErr}</p>
                                </div>
                                <div className="col">
                                    <label for="exampleFormControlSelect1">Status</label>
                                    <select class="form-control" id="status" name="status" onChange={e => onInputChange(e)} >
                                    <option value={requestData.status} selected>{arStatus[requestData.status]}</option>
                                    <option></option>
                                    {
                                         statusList?.map((item, i) => (
                                            
                                          <option value={item.id}>{item.type}</option>    
                                         
                                        ))
                                      
                                        }
                                    </select>
                                    <p style={{color:'red'}}>{statusErr}</p>
                                </div>
                                </div>
                                <div className="row">
                                  
                                   

                                        
                                 
                                    <div className="col">
                                    <label for="exampleFormControlTextarea1">Particulars</label>
                                    <textarea class="form-control" id="particulars"  name="particulars" onChange={e => onInputChange(e)}  rows="3" value ={requestData.particulars}></textarea>
                                    <p style={{color:'red'}}>{particularsErr}</p>
                                </div>
                                </div>
                                <br/>
                                    <button className="btn btn-primary btn-user btn-block"  type="submit"> 
                                        Update
                                    </button>

                                    <label id="message"> </label>
                                    <hr/>
                                      
                                   
                                </form>
</div>
             <Footer/>    
            </div>
        </div>
  
 </div>

    )
}

export default EditRequest;