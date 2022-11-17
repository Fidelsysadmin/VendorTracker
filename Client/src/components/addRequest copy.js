import React, {useState,Component, PropTypes, useEffect} from "react";
// import RichTextEditor from 'react-rte';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link,useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
import date from 'date-and-time';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
// import { ToastContainer,toast} from 'react-toastify';
function AddRequest(){
    let navigate = useNavigate();
    let userDetails = JSON.parse(localStorage.getItem("userInfo"));
    let userID = userDetails[0];
    const [requestData,setRequestData] = useState({
        dor_time:"",
        request_from:"",
        date_of_closure:"",
        co_ordinator:"",
        source_language:"",
        target_language:"",
        service_type:"",
        particulars:"",
        status:"",
        eCode:"",
        createdBy:userDetails[0],
        filename:"",
        mimetype:"",
        path:"",
    })

   
    const {dor_time,request_from,co_ordinator,source_language,target_language,service_type,particulars,status,createdBy,date_of_closure,filename,mimetype,path} = requestData;
    const [files, setFiles] = useState([]);
    const [filesResponse,setFilesResponse] = useState()
    const [filesReponseMessage,setFilesResponseMessage] = useState("")
    const [requestDateErr,setRequestDateErr] = useState([])
    const [requestFromErr,setRequestFromErr] = useState([])
    const [coordinatorErr,setCoordinatorErr] = useState([])
    const [requestDOCErr,setRequestDOCErr] = useState([])
    const [sourceErr,setSourceErr] = useState([])
    const [targetErr,setTargetErr] = useState([])
    const [serviceTypeErr,setServiceTypeErr] = useState([])
    const [particularsErr,setParticularsErr] = useState([])
    const [statusErr,setStatusErr] = useState([])
    const [userList,setUserList] = useState([])
    const [getAllMasters,setGetAllMasters] = useState([])
    const [languageList,setLanguageList] = useState([])
    const [statuslist,setStatuslist] = useState([])
    const [serviceTypelist, setServiceTypeList] = useState([])
    
    const handleSelect = function(selectedItems) {
        const flavors = [];
        for (let i=0; i<selectedItems.length; i++) {
            flavors.push(selectedItems[i].value);
        }
        requestData.target_language = flavors
    }

    const handleFileSelect = async (e) => {
        setFiles(e.target.files)
        
      }
     
    //  console.log(requestData)
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

    const onInputChange = async (e) => {
      
        setRequestData({...requestData,[e.target.name] : e.target.value});
       
    };
  
    const onDateChange = date => setRequestData({...requestData, dor_time: date})
    const onClosureDateChange = date => setRequestData({...requestData, date_of_closure: date})


       const onSubmit = async e => {
        e.preventDefault();
        const isValid = formValidation();
        if(isValid == true)
        {
            const data = new FormData();
            data.append('file', files[0]);
           
          let  response =  await axios.post(apiUrl+`uploadRequestFile`, data,{
                headers: {
                          'Content-Type': 'multipart/form-data',
                        },
            }).then((response) => {setFilesResponse(response.data[0])})
                console.log(filesResponse)
            var dateValue = new Date(requestData.dor_time);
            dateValue = date.format(dateValue,'YYYY-MM-DD');
            var dateFormat = new Date(requestData.dor_time);
             dateFormat = date.format(dateFormat,'DDMMYYYY');
           
             const result = await axios.get(apiUrl+`requestMonthData/${dateValue}`);
            var dateFormatValues = result.data;
            let arRequestData = [];
            let fixDateValue =dateFormat+'A';
            var eCode;
            if(dateFormatValues && dateFormatValues.length > 0)
            { 
                dateFormatValues.forEach(element => {
                 var code = element.e_code;
                  var lastChar = code.slice(-1);  
                arRequestData.push(lastChar);
                });
               
    
                arRequestData.sort(function (a, b) {
                    return a.localeCompare(b);  
                  });
                  
                function nextChar(c) {
                   return (String.fromCharCode(c.charCodeAt(0) + 1));
                }
                var lastElement = arRequestData[arRequestData.length - 1];
                var lastElementValue = nextChar(lastElement);
                eCode = dateFormat+lastElementValue
                 
    
            } else
            {
                eCode = fixDateValue
            }
            requestData.eCode = eCode
            var requestDateTime = moment(requestData.dor_time).format("YYYY-MM-DD hh:mm:ss")
            // var requestDateTime = '2022-10-20 12:10:00'
            requestDateTime = requestDateTime.split("-");
            var requestDate = requestDateTime[2].split(" ");
            var requestDateHour = new Date(requestData.dor_time).getHours() 
            var requestDateMinutes = new Date(requestData.dor_time).getMinutes() 
            var requestDateTime = requestDateTime[0]+'-'+requestDateTime[1]+'-'+requestDate[0]+' '+requestDateHour+':'+requestDateMinutes
            requestData.dor_time =  requestDateTime
            var dateOfClosure =  moment(requestData.date_of_closure).format("YYYY-MM-DD hh:mm:ss")
            // var dateOfClosure = '2022-10-20 12:10:00';
            dateOfClosure = dateOfClosure.split("-");
            var closureDate = dateOfClosure[2].split(" ");
            var closureDateHour = new Date(requestData.date_of_closure).getHours() 
            var closureDateMinutes = new Date(requestData.date_of_closure).getMinutes() 
            var dDateOfClosure = dateOfClosure[0]+'-'+dateOfClosure[1]+'-'+closureDate[0]+' '+closureDateHour+':'+closureDateMinutes
            requestData.date_of_closure =  dDateOfClosure
            requestData.filename = filesResponse.originalname
            requestData.mimetype = filesResponse.mimetype
            requestData.path = filesResponse.path  
            setRequestData({...requestData, path: filesResponse.path})
            await axios.post(apiUrl+`requestInsert`,requestData);
            navigate("/dashboard");            
        }
    }
    useEffect(()=> {
        loadRequestForm();
    },[])

    
    const loadRequestForm = async e => {
        requestData.request_from = userID;
        requestData.dor_time = new Date();
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
    
      let todaysDate = moment().toDate();
      todaysDate = moment(todaysDate).format('DD/MM/YYYY h:mm');

    const formValidation = () =>{
        let isValidRequestDate = true;
        let isValidRequestClosureDate = true;
        let isValidRequestFrom = true;
        let isValidCoordinator = true;
        let isValidSource = true;
        let isValidTarget = true;
        let isValidServieType = true;
        let isValidParticulars = true;
        let isValidStatus = true;
        let isValid =true;
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

        if(isValidRequestDate == true && isValidRequestFrom == true && isValidCoordinator == true && isValidSource == true && isValidTarget == true && isValidServieType == true && isValidParticulars == true && isValidStatus == true && isValidRequestClosureDate == true)
        {
            isValid = true;
        }else
        {
            isValid = false;
        }

        return isValid;
    } 
    var arStatus = []
    
     statuslist.map((item,index) => {
         if(item.id != '1')
         {
            arStatus[item.id] = item.type
         }
        
     })
     var arUser = []
    userList.map((item,index) =>{
        arUser[item.id] = item.name
    })
    return( 
       
        <div id="wrapper">
        <Sidebar/> 
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content"> 
            <Header/> 
           <div style={{width:"500px",marginLeft:"270px"}}>
 
           <form className="user" onSubmit = { (e) => onSubmit(e)} >
           {/* <form> */}
                                    <div className="row">
                                    <div className="col">
                                    
                                        <label>DOR and time</label>
                                       
                                        <Datetime   id="dor_time" name="dor_time" aria-describedby="emailHelp" onChange={ date => onDateChange(date)}  
                                        value = {moment(requestData.dor_time).format("MM/DD/YYYY hh:mm a")}  
                                         />                                      

                                            <p style={{color:'red'}}>{requestDateErr}</p>
                                    </div>

                                    <div className="col">
                                    
                                        <label>Date of Closure</label>
                                       
                                        <Datetime   id="date_of_closure" name="date_of_closure" aria-describedby="emailHelp" onChange={ date => onClosureDateChange(date)} 
                                          />                                      
                        
                                            <p style={{color:'red'}}>{requestDOCErr}</p>
                                    </div>
                                        </div>
                                        <div className="row">
                                    <div className="col"> 
                                    <label for="exampleFormControlSelect1">Request from</label>
                                  
                                    <select class="form-control" id="request_from" name="request_from" onChange={e => onInputChange(e)} >
                                    <option value={requestData.request_from} selected>{arUser[requestData.request_from]}</option>
                                    <option> </option>
                                        {
                                         userList?.map((item, i) => (
                                        // item.id != userID   ?
                                             <option value={item.id}>{item.name}   </option>
                                          //  : null 
                                        ))
                                      
                                        }
                               
                               </select>
                               <p style={{color:'red'}}>{requestFromErr}</p>
                                    </div>
                               
                               
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Co-ordinator</label>
                                    <select class="form-control" id="co_ordinator" onChange={e => onInputChange(e)} name="co_ordinator" >
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
                                    <select class="form-control" id="source_language" name="source_language" multiple={true}  onChange={(e)=> {sourceSelect(e.target.selectedOptions)}}  >
                                    <option></option>
                                    {                                        
                                        languageList?.map((item, i) => (                                            
                                          <option value={item.value}>{item.key}</option>    
                                         
                                        ))
                                        };   
                                    </select>
                                    <p style={{color:'red'}}>{sourceErr}</p>
                                  </div>
                                 
                               
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Target</label>
                                    <select class="form-control" id="target_language[]" name="target_language" multiple={true}  onChange={(e)=> {handleSelect(e.target.selectedOptions)}} >
                                    <option></option>
                                    {
                                         languageList?.map((item, i) => (
                                            
                                          <option value={item.value}>{item.key}</option>    
                                         
                                        ))
                                      
                                        }   
                                    </select> 
                                    <p style={{color:'red'}}>{targetErr}</p>
                                </div>
                                </div>
                                <div className="row">
                               
                                    <div className="col">
                                    <label for="exampleFormControlSelect1">Service Type</label>
                                    <select class="form-control" id="service_type" name="service_type" multiple={true}  onChange={(e)=> {serviceSelect(e.target.selectedOptions)}} >
                                    <option></option>
                                    {
                                         serviceTypelist?.map((item, i) => (
                                            
                                          <option value={item.key}>{item.value}</option>    
                                         
                                        ))
                                      
                                        }   
                                    </select>
                                    <p style={{color:'red'}}>{serviceTypeErr}</p>
                                </div>                             
                                    
                                <div className="col">
                                    <label for="exampleFormControlSelect1">Status</label>
                                    <select class="form-control" id="status" name="status" onChange={e => onInputChange(e)}  >
                                    <option></option>
                                    {
                                         arStatus?.map((item, i) => (
                                            
                                          <option value={i}>{item}</option>    
                                         
                                        ))
                                      
                                        }
                                    </select>
                                    <p style={{color:'red'}}>{statusErr}</p>
                                </div>
                            

                                </div>
                                {/* <div className="row">
                                    
                                    

                                <div className="col">
                                    <label for="exampleFormControlTextarea1">Particulars</label>
                                    <textarea class="form-control" id="particulars"  name="particulars" onChange={e => onInputChange(e)}  rows="3"></textarea>
                                    <p style={{color:'red'}}>{particularsErr}</p>
                                </div>

                                
                                </div> */}

<div className="row">
                                    
                                    

                                    <div className="col">
                                        <label for="exampleFormControlTextarea1">Particulars</label>
                                        <textarea class="form-control" id="particulars"  name="particulars" onChange={e => onInputChange(e)}  rows="3"></textarea>
                                        <p style={{color:'red'}}>{particularsErr}</p>
                                    </div>
    
                                    
                                    </div>
                                    <div className="row">
    
                                    <div className="col">
                                        <label for="exampleFormControlTextarea1">File</label>
                                        <input type="file" onChange={handleFileSelect}/>
                                    </div>
                                    </div>

                                <br/>
                                    <button className="btn btn-primary btn-user btn-block"  type="submit"> 
                                        Insert
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

export default AddRequest;