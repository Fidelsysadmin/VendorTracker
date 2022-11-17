import React, {useState,useEffect,useRef} from "react";
import { baseUrl,apiUrl } from "../constant/constant";
import { Link,useParams,useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios, { Axios } from "axios";
import moment from 'moment';
import { subSeconds } from "date-fns";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import date from 'date-and-time';
import fileDownload from "js-file-download";
function EditRequest(){
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let role = userInfo[1]
    let navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef();
    const [val, setValue] = useState("");
    const [myFile,setMyFile] = useState(null)
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
        filename:"",
        mimetype:"",
        path:"",
        files:"",
        eCode:"",
    })


    const {dor_time,request_from,co_ordinator,source_language,target_language,service_type,particulars,status,date_of_closure,doc_vmpm,userRole,filename,mimetype,path,files,eCode} = requestData;
    const onInputChange = e => {
          setRequestData({...requestData,[e.target.name] : e.target.value});
           
    };
    // const [files, setFiles] = useState([]);
    const [filesResponse,setFilesResponse] = useState([])
    const [filesReponseMessage,setFilesResponseMessage] = useState("")
    const [newFile, setNewFile] = useState("")
    const [newData,setNewData] = useState([])
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

    const handleFileSelect = async (e) => {
        setRequestData({...requestData, files:e.target.files})
        // setMyFile(e.target.files[0])
      }
     const download = async (e) => {
        e.preventDefault();
        if(requestData.filename != '')
        {
            axios({
                url : apiUrl+"requestFile",
                data: {requestID : id},
                method : "post",
                responseType : "blob",
            }).then((res) => {
                console.log(res);
                fileDownload(res.data,requestData.filename);
            });
        }
      };
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
        // setRequestData({...requestData, files:e.target.files})

      const getfile = await axios.get(apiUrl+`getFile`);
    //   setRequestData({...requestData, files:getfile.data})
    //  localStorage.setItem('getFile', getfile.data);
    // fileInputRef.current.value = "";
    // setValue("");
    // console.log(getfile.data);
     
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
    //    setRequestData({...requestData, files:requestData.files})
        // var requestDateTime = moment(requestData.dor_time).format("YYYY-MM-DD hh:mm:ss")
        var requestDateTime = '2022-10-20 12:10:00';
        requestDateTime = requestDateTime.split("-");
        var requestDate = requestDateTime[2].split(" ");
        var requestDateHour = new Date(requestData.dor_time).getHours() 
        var requestDateMinutes = new Date(requestData.dor_time).getMinutes() 
        var requestDateTime = requestDateTime[0]+'-'+requestDateTime[1]+'-'+requestDate[0]+' '+requestDateHour+':'+requestDateMinutes
        requestData.dor_time =  requestDateTime
         
        // var dateOfClosure =  moment(requestData.date_of_closure).format("YYYY-MM-DD hh:mm:ss")
        var dateOfClosure = '2022-10-20 12:10:00'
        dateOfClosure = dateOfClosure.split("-");
        var closureDate = dateOfClosure[2].split(" ");
        var closureDateHour = new Date(requestData.date_of_closure).getHours() 
        var closureDateMinutes = new Date(requestData.date_of_closure).getMinutes() 
        var dDateOfClosure = dateOfClosure[0]+'-'+dateOfClosure[1]+'-'+closureDate[0]+' '+closureDateHour+':'+closureDateMinutes
        requestData.date_of_closure =  dDateOfClosure
        if(requestData.doc_vmpm)
        {
            // var docVMPM =  moment(requestData.doc_vmpm).format("YYYY-MM-DD hh:mm:ss")
            var docVMPM = '2022-10-20 12:10:00'
            docVMPM = docVMPM.split("-");
            var docVMPMDate = docVMPM[2].split(" ");
            var docVMPMHour = new Date(requestData.doc_vmpm).getHours() 
            var docVMPMMinutes = new Date(requestData.doc_vmpm).getMinutes() 
            var dDocVMPM = docVMPM[0]+'-'+docVMPM[1]+'-'+docVMPMDate[0]+' '+docVMPMHour+':'+docVMPMMinutes
            requestData.doc_vmpm =  dDocVMPM
        }
       
        requestData.userRole = role
        // const data = new FormData();
        // data.append('file', files[0]);
        // axios.post(apiUrl+`uploadRequestFile`, data)
        //     .then((response) => {setFilesResponse(response.data[0])})
        //     .catch((e) => {setFilesResponseMessage(e.data)})
       if(isValid == true)
        {    
            const data = new FormData();
            if ('files' in requestData)
            {
                data.append('files', requestData.files[0]);
            }
            data.append('id',id);
            data.append('co_ordinator',requestData.co_ordinator);
            data.append('createdBy',requestData.createdBy);
            data.append('date_of_closure',requestData.date_of_closure);
            data.append('dor_time',requestData.dor_time);
            data.append('e_code',requestData.e_code);
            data.append('particulars',requestData.particulars);
            data.append('request_from',requestData.request_from);
            data.append('service_type',requestData.service_type);
            data.append('source_language',requestData.source_language);
            data.append('status',requestData.status);
            data.append('target_language',requestData.target_language);
            data.append('userRole',requestData.userRole);
            if(requestData.doc_vmpm != '' || requestData.doc_vmpm != null)
            {
               data.append('doc_vmpm',requestData.doc_vmpm);
            }
            
            // if ('files' in requestData)
            // {
            //     console.log(requestData)
            //     let  response =  await axios.post(apiUrl+`updateRequest`, data,{
            //         headers:{
            //                   'Content-Type': 'multipart/form-data',
            //                 },
            //     }).then((response) => {setFilesResponse(response.data[0])})
                
            // } else
            // {
            //     data.append('files', requestData.files[0]);
                
            // }
            console.log(requestData)
            let  response =  await axios.post(apiUrl+`requestFileUpdate`, data,{
                        headers:{
                                  'Content-Type': 'multipart/form-data',
                                },
                    }).then((response) => {setFilesResponse(response.data[0])})
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
    // console.log(requestData.eCode)

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
                                            requestData.service_type.indexOf(item.value) > -1 ?
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
                                <div className="row">
    
                                    <div className="col">
                                        <label for="exampleFormControlTextarea1">File</label>
                                        <input type="file"  id="files" name="files"  onChange={handleFileSelect} />
                                        {
                                            newFile == '' ?
                                            <Link onClick={(e) => download(e)} style={{marginLeft:"-100px"}} to={requestData.filename} >{requestData.filename}</Link>  
                                            : null  
                                                                                     
                                        }
                                         
                                         
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