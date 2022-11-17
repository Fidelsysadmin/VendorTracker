import React, {useState,Component, PropTypes, useEffect} from "react";
import RichTextEditor from 'react-rte';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link ,useParams,useNavigate} from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
function StatausMasterForm(){
    let navigate = useNavigate();
    const [statusValue,setStatusValue] = useState([])
    const [statusData,setStatusData] = useState([])
    const [statusValueErr,setStatusValueErr] = useState([])

     async function insertStatusMaster(){
        const isValid = formValidation();
        // console.warn("data",statusValue)
        let request = await fetch(apiUrl+'statusInsert',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                statusValue:statusValue,
                
                
            })
        })

        let response = await request.json();
        console.log(response.status)
        if (response.status === 200) {
            navigate("/statusMaster");     
          
        } 
    }
     
    const formValidation = () =>{
        let isValid = true;
        if(statusValue == '')
        {
            setStatusValueErr('Please Enter the Status');
            isValid = false;
        } else
        {
            setStatusValueErr('');
            isValid = true;
        }
        return isValid;
    } 

    let urlParam = useParams();
    let id = urlParam.id;
    useEffect(() => {
 
        fetch(apiUrl+`status/${id}`).then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(responseStatus => setStatusData(responseStatus))  
    

         
    }, [])
    // alert(statusValue.type);
    console.log(statusData);

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
                                    <label for="exampleFormControlTextarea1">Status</label>
                                    <input type="text" class="form-control" name="statusValue" id="statusValue"  onChange={(e) => setStatusValue(e.target.value)}/> 
                                </div>
                               
                                </div>
                                <br/>
                                <p style={{color:'red'}}>{statusValueErr}</p>
                                    <button className="btn btn-primary btn-user btn-block"  type="button" onClick={insertStatusMaster}> 
                                        Insert
                                    </button>

                                    
                                    <hr/>
                                      
                                   
                                </form>
</div>
             <Footer/>    
            </div>
        </div>
  
 </div>

    )
}

export default StatausMasterForm;