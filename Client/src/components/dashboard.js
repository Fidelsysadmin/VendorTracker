import React from "react";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Content from "./content";
import Sidebar from "./sidebar";
import Login from "./login";
function Dashboard(){

  
    return(
       
        <div id="wrapper">
            <Sidebar/> 
            <div id="content-wrapper" class="d-flex flex-column">
                <div id="content"> 
                <Header/> 
                  <Content/>
                 {/* <Footer/>    */}
                </div>
            </div>
     </div>
    
    );
}

export default Dashboard;