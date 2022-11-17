import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link ,useParams,useNavigate} from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
 
const EditServiceType = () => {

   let navigate = useNavigate();
    const { id } = useParams();
    const [serviceTypeData,setPlatFormData] = useState({
        key: "",
        value:""
    });
    const [keyErr,setKeyErr] = useState([])
    const [valueErr,setValueErr] = useState([])
    const {	key,value} = serviceTypeData;
    const onInputChange = e => {
        setPlatFormData ({ ...serviceTypeData, [e.target.name] : e.target.value});
    };

    useEffect(() => {
        loadPlatForm();
    },[])

    const onSubmit = async e => {
        e.preventDefault();
        const isValid = formValidation();
        if(isValid === true)
        {
           // console.log('success')
            await axios.put(apiUrl+`serviceTypeUpdate/${id}`,serviceTypeData);
            navigate("/serviceTypeMaster");            
        }
        
    };

    const loadPlatForm = async e => {
        const result = await axios.get(apiUrl+`serviceType/${id}`);
        setPlatFormData(result.data);
       
    }

    const formValidation = () =>{
        let isValidKey = true;
        let isValidValue = true;
        let isValid = true;
        if(key == '')
        {
            setKeyErr('Please Enter the Key');
            isValidKey = false;
        } else
        {
            setKeyErr('');
            isValidKey = true;
        }

        if(value == '')
        {
            setValueErr('Please Enter the Value');
            isValidValue = false;
        } else
        {
            setValueErr('');
            isValidValue = true;
        }
        if(isValidKey == true && isValidValue == true)
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

<form className="user" onSubmit={e => onSubmit(e)}>                            
                                                   
<div className="row">
                    
                                <div className="col">
                                    <label for="exampleFormControlTextarea1">Key</label>
                                    <input type="text" class="form-control" id="key" name="key"  onChange={e => onInputChange(e)} value={serviceTypeData.key}/> 
                                    <p style={{color:'red'}}>{keyErr}</p>

                                </div>

                                <div className="col">
                                    <label for="exampleFormControlTextarea1">Value</label>
                                    <input type="text" class="form-control" id="value" name="value"  onChange={e => onInputChange(e)} value={serviceTypeData.value}/> 
                                    <p style={{color:'red'}}>{valueErr}</p>

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

export default EditServiceType;