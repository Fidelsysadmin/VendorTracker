import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link ,useParams,useNavigate} from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
 
const EditSearchPlatFormMaster = () => {

   let navigate = useNavigate();
    const { id } = useParams();
    const [platFormData,setPlatFormData] = useState({
        search_name: "",
    });
    const [nameErr,setNameErr] = useState([])
    const {	search_name} = platFormData;
    const onInputChange = e => {
        setPlatFormData ({ ...platFormData, [e.target.name] : e.target.value});
    };

    useEffect(() => {
        loadPlatForm();
    },[])

    const onSubmit = async e => {
        e.preventDefault();
        const isValid = formValidation();
        if(isValid == true)
        {
            await axios.put(apiUrl+`searchPlatformUpdate/${id}`,platFormData);
            navigate("/searchPlatFormMaster");            
        }
        
    };

    const loadPlatForm = async e => {
        const result = await axios.get(apiUrl+`searchPlatform/${id}`);
        setPlatFormData(result.data);
        
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

<form className="user" onSubmit={e => onSubmit(e)}>                            
                                                   
<div className="row">
                    
                                <div className="col">
                                    <label for="exampleFormControlTextarea1">Name</label>
                                    <input type="text" class="form-control" id="searchPlatformName" name="search_name"  onChange={e => onInputChange(e)} value={platFormData.search_name}/> 
                                    <p style={{color:'red'}}>{nameErr}</p>

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

export default EditSearchPlatFormMaster;