import React, {useState,Component, PropTypes, useEffect} from "react";
import RichTextEditor from 'react-rte';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link ,useParams,useNavigate} from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
function SearchPlatFormMasterForm(){
    let navigate = useNavigate();
    const [search_name,setSearchPlatformName] = useState([])
    const [nameErr,setNameErr] = useState([])
     async function SearchPlatFormInsert(){
        const isValid = formValidation();
        let request = await fetch(apiUrl+'SearchPlatFormInsert',{
            method : 'POST',
            cache: 'no-cache',
            headers : {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Accept' : 'application/json, text/plain'
                        
                      },
            body : JSON.stringify({
                search_name:search_name,                  
            })
        })

        let response = await request.json();
        console.log(response.status)
        if (response.status === 200) {
           navigate("/searchPlatFormMaster");     
          
        }  
    }
     
    const formValidation = () =>{
        let isValid = true;
        if(search_name == '')
        {
            setNameErr('Please Enter the Name');
            isValid = false;
        } else
        {
            setNameErr('');
            isValid = true;
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
                                    <label for="exampleFormControlTextarea1">Name</label>
                                    <input type="text" class="form-control" id="search_name"   name = 'search_name' onChange={(e) => setSearchPlatformName(e.target.value)}/> 
                                    <p style={{color:'red'}}>{nameErr}</p>
                                </div>

                                

                                </div>
                                <br/>
                                    <button className="btn btn-primary btn-user btn-block"  type="button" onClick={SearchPlatFormInsert}> 
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

export default SearchPlatFormMasterForm;