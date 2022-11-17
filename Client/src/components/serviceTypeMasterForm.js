import React, {useState,Component, PropTypes, useEffect} from "react";
import RichTextEditor from 'react-rte';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link ,useParams,useNavigate} from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
function ServiceTypeMasterForm(){
    let navigate = useNavigate();
    const [sourceTargetKey,setSourceTargetKey] = useState([])
    const [sourceTargetValue,setSourceTargetValue] = useState([])
    const [keyErr,setKeyErr] = useState([])
    const [valueErr,setValueErr] = useState([])
     async function serviceTypeInsert(){
        const isValid = formValidation();
        if(isValid == true)
        {
        let request = await fetch(apiUrl+'serviceTypeInsert',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                sourceTargetKey:sourceTargetKey,
                sourceTargetValue:sourceTargetValue,          
                
            })
        })

        let response = await request.json();
        console.log(response.status)
        if (response.status === 200) {
            navigate("/serviceTypeMaster");     
          
            } 
        }
    }
     
    const formValidation = () =>{
        let isValidKey = true;
        let isValidValue = true;
        let isValid = true;
        if(sourceTargetKey == '')
        {
            setKeyErr('Please Enter the Key');
            isValidKey = false;
        } else
        {
            setKeyErr('');
            isValidKey = true;
        }

        if(sourceTargetValue == '')
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

<form className="user">
 
                                     
                                 
                                 
                                                   
<div className="row">
                                    

                                <div className="col">
                                    <label for="exampleFormControlTextarea1">Key</label>
                                    <input type="text" class="form-control" id="sourceTargetKey"  onChange={(e) => setSourceTargetKey(e.target.value)}/> 
                                    <p style={{color:'red'}}>{keyErr}</p>
                                </div>

                                <div className="col">
                                    <label for="exampleFormControlTextarea1">Value</label>
                                    <input type="text" class="form-control" id="sourceTargetValue"  onChange={(e) => setSourceTargetValue(e.target.value)}/> 
                                    <p style={{color:'red'}}>{valueErr}</p>
                                </div>

                                </div>
                                <br/>
                                    <button className="btn btn-primary btn-user btn-block"  type="button" onClick={serviceTypeInsert}> 
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

export default ServiceTypeMasterForm;