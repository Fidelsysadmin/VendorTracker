import React, { useEffect, useState } from 'react'
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import axios from 'axios';
import { apiUrl, baseUrl } from '../constant/constant';
import { Link, useParams,useNavigate} from 'react-router-dom';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
function Response() {
    let navigate = useNavigate();
    const [allServiceType, setAllServiceType] = useState([])
    const [userList, setUserList] = useState([])
    const [responseFrom, setResponseFrom] = useState([])
    const [responseDate, setResponseDate] = useState()
    const [comment, setComment] = useState([])
    const [responseAll, setResponseAll] = useState([])
    const [languageList, setLanguageList] = useState([])
    const [statusList,setStatusList] = useState([])
    const [serviceTypeList,setServiceTypeList] = useState([])
    const [responseFromErr,setResponseFromErr] = useState([])
    const [responseDateErr,setResponseDateErr] = useState([])
    const [commentErr,setCommentErr] = useState([])
    
    let urlParam = useParams();
    let id = urlParam.id;

    const onDateChange = date => setResponseDate(date)


    useEffect(() => {
        setResponseDate(new Date());
        fetch(apiUrl + `request/${id}`).then(res => {
            if (res.ok) {
                return res.json()
            }
        }).then(responseAllStatus => setAllServiceType(responseAllStatus))

        fetch(baseUrl + "all_user_list/").then(res => {
            if (res.ok) {
                return res.json()
            }
        }, []).then(responseAllUser => setUserList(responseAllUser.Output))

        fetch(apiUrl + "response/" + id).then(res => {
            if (res.ok) {
                return res.json()
            }
        }, []).then(allResponse => setResponseAll(allResponse))

        fetch(apiUrl + "languageList/").then(res => {
            if (res.ok) {
                return res.json()
            }
        }, []).then(allResponse => setLanguageList(allResponse))

        fetch(apiUrl + "status/").then(res => {
            if (res.ok) {
                return res.json()
            }
        }, []).then(allResponse => setStatusList(allResponse))

        fetch(apiUrl + "serviceTypes/").then(res => {
            if (res.ok) {
                return res.json()
            }
        }, []).then(allResponse => setServiceTypeList(allResponse))

    }, [])

   
    async function insertResponse() {
        const isValid = formValidation();
     
        var requestDateTime = moment(responseDate).format("YYYY-MM-DD hh:mm:ss")
            requestDateTime = requestDateTime.split("-");
            var requestDate = requestDateTime[2].split(" ");
            var requestDateHour = new Date(responseDate).getHours() 
            var requestDateMinutes = new Date(responseDate).getMinutes() 
            var requestDateTime = requestDateTime[0]+'-'+requestDateTime[1]+'-'+requestDate[0]+' '+requestDateHour+':'+requestDateMinutes
          
        if(isValid == true)
        {
            
        let request = await fetch(apiUrl + 'responseInsert', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json, text/plain'

            },
            body: JSON.stringify({
                responseBy: responseFrom,
                responseByDate: requestDateTime,
                responseComment: comment,
                requestID: id,
                requestFrom:allServiceType.request_from,        

            })
        })

        let response = await request.json();
        console.log(response)
        if (response.status === 200) {
           window.location.href = "/response/" + id;
        //   navigate("/response/"+id);
          var allResponse = allResponse.filter((item) => {
            // return item.id == id;
            return item;
        })
        setResponseAll(allResponse);  
        }
        }
    }

    var arLanguage = []
    languageList.map((item,index) => {
          arLanguage[item.value] = item.key
    })

    var arUser = []
    userList.map((item,index) =>{
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

     const formValidation = () =>{
        let isValidResponseFrom = true;
        let isValidResponseDate = true;
        let isValidComment = true;
        let isValid = true
        if(responseFrom == '')
        {
            setResponseFromErr('Select the Response from');
            isValidResponseFrom = false;
        } else
        {
            setResponseFromErr('');
            isValidResponseFrom = true;
        }

        if(responseDate == '')
        {
            setResponseDateErr('Select the Request Date');
            isValidResponseDate = false;
        } else
        {
            setResponseDateErr('');
            isValidResponseDate = true;
        }


        if(comment == '')
        {
            setCommentErr('Enter the Comment');
            isValidComment = false;
        } else
        {
            setCommentErr('');
            isValidComment = true;
        }

        if(isValidResponseFrom == true && isValidResponseDate == true && isValidComment == true)
        {
            isValid = true;
        }else
        {
            isValid = false;
        }
        
        return isValid;
    } 
   
   
    return (

        <div id="wrapper">
            <Sidebar />
            <div id="content-wrapper" class="d-flex flex-column">
                <div id="content">
                    <Header />
                    <>

                        <div style={{ marginLeft: "10px" }}>
                            <h2></h2>
                        </div>
                        <div className="container-fluid">

                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Request</h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                            <thead>
                                                <tr>
                                                    <th width="10%">Date of Request</th>
                                                    <th width="10%">Request from</th>
                                                    <th width="10%">Co-Ordinator</th>
                                                    <th width="10%">Source</th>
                                                    <th width="10%">Target</th>
                                                    <th width="10%">Service Type</th>
                                                    <th width="10%">Status</th>
                                                    <th width="30%">Particulars</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                        <tr>

                                                            <td>{moment(allServiceType.dor_time).format("DD-MM-YYYY hh:mm a")}</td>

                                                            <td>{arUser[allServiceType.request_from]}</td>
                                                            <td>{arUser[allServiceType.co_ordinator]}</td>
                                                            <td>{arLanguage[allServiceType.source_language]}</td>
                                                            <td>{arLanguage[allServiceType.target_language]}</td>
                                                            <td>{arServiceType[allServiceType.service_type]}</td>
                                                            <td>{arStatus[allServiceType.status]}</td>
                                                            <td>{allServiceType.particulars}</td>

                                                        </tr>
                                                    
                                            </tbody>
                                        </table>

                                        <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Response</h6>
                                </div>
                                        <table className="table table-bordered" id="dataTable1" width="100%" cellspacing="0">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Response from</th>
                                                    <th>DOR and Time</th>
                                                    <th>Comment</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    responseAll?.map((item, index) => {
                                                        return(
                                                        // console.log("123", item);
                                                        <tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>{arUser[item.response_by]}</td>
                                                            <td>{moment(item.response_by_date).format("DD-MM-YYYY hh:mm a")}</td> 
                                                             <td>{item.comments}</td>
                                                        </tr>
                                                        )
                                                    })
                                                }
                                               
                                            </tbody>
                                        </table>

                                    </div>

                                    <form className="user">





                                        <div className="row">


                                            <div className="col">
                                                <label for="exampleFormControlSelect1">Response from</label>

                                                <select class="form-control" id="responseFrom" onChange={(e) => setResponseFrom(e.target.value)} >
                                                    <option></option>

                                                    {
                                                        userList?.map((item, i) => (

                                                            <option value={item.id}>{item.name}</option>

                                                        ))

                                                    }

                                                </select>
                                                <p style={{color:'red'}}>{responseFromErr}</p>
                                            </div>
                                            <div className="col">
                                                <label>DOR and time</label>
                                               
                                        <Datetime   id="responseDate" name="responseDate" aria-describedby="emailHelp" onChange={ date => onDateChange(date)} value = {moment(responseDate).format("MM/DD/YYYY h:m a")}
                                         
                                         />

                                                     <p style={{color:'red'}}>{responseDateErr}</p>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <label for="exampleFormControlTextarea1">Comment</label>
                                                <textarea class="form-control" id="comment" onChange={(e) => setComment(e.target.value)} rows="3"></textarea>
                                                <p style={{color:'red'}}>{commentErr}</p>
                                            </div>

                                            <div className="col">
                                                <button className="btn btn-primary btn-user btn-block" type="button" onClick={insertResponse}>
                                                    Insert
                                                </button>
                                            </div>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </>
                    <Footer />
                </div>
            </div>

        </div>

    );
}

export default Response;