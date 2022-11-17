


import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import "./sidebar.css"
function Sidebar(){
    const [visible, setVisible] = useState(false)
    const [isActive, setActive] = useState(false);
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const toggleClass = () => {
        setActive(!isActive);
      };

    return(
         
        <ul className={isActive ? 'navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled': "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"}  id="accordionSidebar">

           
            <div class="sidebar-brand-text mx-3">  
            <img src= {isActive ? '../../assets/img/fidel_only-logo.png': "../../assets/img/fidellogo.png"} className={isActive ? 'imglogo1': "imglogo"}/>
            </div>
           
        <hr class="sidebar-divider my-0"/>       
        <li class="nav-item">
            <Link to={"/dashboard"} class="nav-link">
                <i class="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span></Link>
        </li>    
        <hr class="sidebar-divider"/>
       
        <li class="nav-item">
            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                aria-expanded="true" aria-controls="collapseTwo">
                <i class="fas fa-fw fa-cog"></i>
                <span>Requests</span>
            </a>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                   
                   <Link to={"/addRequest"} class="collapse-item"> Create Request </Link>
                    <Link to={"/openRequest"} class="collapse-item">Open Request</Link>
                    <Link to={"/closedRequest"} class="collapse-item">Closed Request</Link>
                    <Link to={"/onHoldRequest"} class="collapse-item">OnHold Request</Link>
                    <Link to={"/cancelledRequest"} class="collapse-item">Cancelled Request</Link>
                    <Link to={"/delayRequest"} class="collapse-item">Delay Request</Link>
                </div>
            </div>
        </li>
        

       
        <hr class="sidebar-divider"/>
        
        { userInfo && userInfo[1] === 'VM' && (  
          <><li class="nav-item">
            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
                aria-expanded="true" aria-controls="collapsePages">
                <i class="fas fa-fw fa-folder"></i>
                <span>Masters</span>
            </a>
            <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                    <Link class="collapse-item" to={"/statusMaster"}>Status</Link> 
                    <Link class="collapse-item" to = {"/sourceTargetMaster"}>Source/Target</Link>
                    <Link class="collapse-item" to={"/serviceTypeMaster"}>Service Type</Link>
                    <Link class="collapse-item" to={"/searchPlatFormMaster"} >Search Platform</Link>
                </div>
            </div>
        </li>

   <li class="nav-item">
            <Link to={"/reports"} class="nav-link">
                <i class="fas fa-fw fa-chart-area"></i>
                <span>Reports</span></Link>
        </li>

        <li class="nav-item">
            <Link to={"/userManagement"} class="nav-link">
                <i class="fas fa-fw fa-chart-area"></i>
                <span>User Management</span></Link>
        </li>

        <hr class="sidebar-divider d-none d-md-block"/>
      
        </>
        )
} 
          <div class="text-center d-none d-md-inline">
                <button class="rounded-circle border-0" id="sidebarToggle" onClick={() => toggleClass()}></button>
            </div>
    </ul>
   
    )
}

export default Sidebar 