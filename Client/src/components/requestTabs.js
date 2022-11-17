import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios';
import {apiUrl}  from '../constant/constant';
function RequestTabs(){
    let currentUserDetails = JSON.parse(localStorage.getItem("userInfo"));
    let userID = currentUserDetails[0];
    let userRole = currentUserDetails[1];
    const [delayCount,setDelayCount] = useState([])
    const [allRequestCount,setAllRequestCount] = useState([])
    const [openRequestCount,setOpenRequestCount] = useState([])
    const [closedRequestCount,setClosedRequestCount] = useState([])
    const [onHoldRequestCount,setOnHoldRequestCount] = useState([])
    const [cancellledRequestCount,setCancelledRequestCount] = useState([])

    useEffect(() => {      
        apiData();      
     },[])
    const apiData = async e =>{
        if(userRole === 'VM' || userRole === 'VC')
        {
            userID = '01';
        } 
         
    let result = await axios.get(apiUrl+'delayRequestCount/',{
        params:{
            'userID':userID
        },
    })
    setDelayCount(result.data.delayRequestCount);
 
    result = await axios.get(apiUrl+'openRequestCount/',{
        params:{
           'userID':userID 
        },
      })
    setOpenRequestCount(result.data);
   
    
    result = await axios.get(apiUrl+'closedRequestCount/',{
        params:{
            'userID':userID
        },
    })
    setClosedRequestCount(result.data);

    result = await axios.get(apiUrl+'onHoldRequestCount/',{
        params:{
            'userID':userID
        },
    })
    setOnHoldRequestCount(result.data);

    result = await axios.get(apiUrl+'allRequestCount/',{
        params:{
           'userID':userID
        },
    })
    setAllRequestCount(result.data);
    result = await axios.get(apiUrl+'cancelledRequestCount/',{
        params:{
             'userID':userID
        },
    })
    setCancelledRequestCount(result.data);
    }


    return(

        <div className="row">
        <div>
   
  </div>
        <div className="col" style={{marginLeft:"20px",height:"110px"}}>
        <Link to={`/dashboard`} style={{ textDecoration: 'none' }}>
                      <div className="card border-left-primary shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-s font-weight-bold text-primary text-uppercase mb-1">
                                          All </div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                                       
                                        {allRequestCount.allRequests}
                                  
                                      </div>
                                      
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                     </Link>
                  </div>

                  <div className="col" style={{height:"110px"}}>
                  <Link to={`/openRequest`} style={{ textDecoration: 'none' }}>
                      <div className="card border-left-primary shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-s font-weight-bold text-primary text-uppercase mb-1">
                                          Open</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{openRequestCount.openRequests}</div>
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                      </Link>
                  </div>


                  <div className="col" style={{height:"110px"}}>
                  <Link to={`/closedRequest`} style={{ textDecoration: 'none' }}>
                      <div className="card border-left-success shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-s font-weight-bold text-success text-uppercase mb-1">
                                          Closed</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{closedRequestCount.closedRequests}</div>
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                      </Link>
                  </div>


                  <div className="col" style={{height:"110px"}}>
                  <Link to={`/onHoldRequest`} style={{ textDecoration: 'none' }}>
                      <div className="card border-left-dark shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-s font-weight-bold text-dark text-uppercase mb-1">
                                          OnHold</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{onHoldRequestCount.onHoldRequests}</div>
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                      </Link>
                  </div>


                  <div className="col" style={{height:"110px"}}>
                  <Link to={`/cancelledRequest`} style={{ textDecoration: 'none' }}>
                      <div className="card border-left-secondary shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-s font-weight-bold text-secondary text-uppercase mb-1">
                                      Cancelled</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{cancellledRequestCount.cancelledRequests}</div>
                                  </div>
                             
                              </div>
                          </div>
                      </div>
                      </Link>
                  </div>

                  <div className="col" style={{height:"110px"}}>
                  <Link to={`/delayRequest`} style={{ textDecoration: 'none' }}>
                      <div className="card border-left-danger shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-s font-weight-bold text-danger text-uppercase mb-1">
                                      Delay</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{delayCount}</div>
                                  </div>
                             
                              </div>
                          </div>
                      </div>
                      </Link>
                  </div>

                  </div>
    )
}

export default RequestTabs