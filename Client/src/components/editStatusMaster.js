import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { baseUrl,apiUrl } from "../constant/constant";
import { Link ,useParams,useNavigate} from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
 
const EditStatusMaster = () => {

   let navigate = useNavigate();
    const { id } = useParams();
    const [statusData,setStatusData] = useState({
        type: "",
    });
    const [typeErr,setTypeErr] = useState([])
    const {	type} = statusData;
    const onInputChange = e => {
        setStatusData ({ ...statusData, [e.target.name] : e.target.value});
    };

    useEffect(() => {
        loadPlatForm();
    },[])

    const onSubmit = async e => {
        e.preventDefault();
        const isValid = formValidation();
        if(isValid == true)
        {
            await axios.put(apiUrl+`statusUpdate/${id}`,statusData);
            navigate("/statusMaster");            
        }
        
    };

    const loadPlatForm = async e => {
        const result = await axios.get(apiUrl+`status/${id}`);
        setStatusData(result.data);
        
    }

    const formValidation = () =>{
        let isValid = true;
        if(type == '')
        {
            setTypeErr('Enter the Status');
            isValid = false;
        } else
        {
            setTypeErr('');
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
                                    <label for="exampleFormControlTextarea1">Status</label>
                                    <input type="text" class="form-control" id="type" name="type"  onChange={e => onInputChange(e)} value={statusData.type}/> 
                                    <p style={{color:'red'}}>{typeErr}</p>

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

export default EditStatusMaster;