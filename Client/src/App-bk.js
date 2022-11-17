import logo from './logo.svg';
import './App.css';
import Header from './layouts/header';
import Footer from './layouts/footer';
import Sidebar from './components/sidebar';
import Login from './components/login';
import { BrowserRouter , Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Content from './components/content'; 
import Register from './components/register';
import AddRequest from './components/addRequest';
import StatusMasterForm from './components/statusMasterForm';
import StatusMaster from './components/statusMaster';
import SourceTargetMaster from './components/sourceTargetMaster';
import SourceTargetMasterForm from './components/sourceTargetMasterForm';
import ServiceTypeMaster from './components/serviceTypeMaster';
import ServiceTypeMasterForm from './components/serviceTypeMasterForm';
import SearchPlatFormMaster from './components/searchPlatFormMaster';
import SearchPlatFormMasterForm from './components/searchPlatFormMasterForm';
import OpenRequest from './components/openRequest';
import ClosedRequest from './components/closedRequest';
import OnHoldRequest from './components/onHoldRequest';
import CancelledRequest from './components/cancelledRequest';
import VerifyLoginOTP from './components/verifyLoginOTP';
import Response from './components/response';
import ResetPasswordValidateOTP from './components/resetPasswordValidateOTP';
import ResetPasswordSendOTP from './components/resetPasswordSendOTP';
import EditRequest from './components/editRequest';
import EditSearchPlatFormMaster from './components/editSearchPlatFormMaster';
import EditStatusMaster from './components/editStatusMaster'; 
import EditServiceType from './components/editServiceType';
import EditSourceTarget from './components/editSourceTarget';
import Reports from './components/reports';
import UserProfile from './components/userProfile';
import VerifyUserLoginOTP from './components/verifyUserLoginOTP';
function App() {

  return (
      <BrowserRouter>
       <Routes>
       <Route path="/" element={<Login />} />        
        <Route path="/dashboard" element={<Dashboard />} />   
        <Route path="/register" element={<Register />} />  
        <Route path="/addRequest" element={<AddRequest />} />             
        <Route path="/statusMaster" element={<StatusMaster />} /> 
        <Route path="/statusMasterForm" element={<StatusMasterForm />} />  
        <Route path="/statusMasterForm/:id" element={<StatusMasterForm />} />  
        <Route path="/sourceTargetMaster" element={<SourceTargetMaster />} />  
        <Route path="/sourceTargetMasterForm" element={<SourceTargetMasterForm />} />  
        <Route path="/serviceTypeMaster" element={<ServiceTypeMaster />} />
        <Route path="/serviceTypeMasterForm" element={<ServiceTypeMasterForm />} />
        <Route path="/searchPlatFormMaster" element={<SearchPlatFormMaster />} />
        <Route path="/searchPlatFormMasterForm" element={<SearchPlatFormMasterForm />} />
        <Route path="/openRequest" element={<OpenRequest />} />
        <Route path="/closedRequest" element={<ClosedRequest />} />
        <Route path="/onHoldRequest" element={<OnHoldRequest />} />
        <Route path="/cancelledRequest" element={<CancelledRequest />} />
        <Route path="/verifyLoginOTP/:email" element={<VerifyLoginOTP />} />
        <Route path="/response/:id" element={<Response />} />
        <Route path="/resetPasswordValidateOTP/:email" element={<ResetPasswordValidateOTP /> } />
        <Route path="/resetPasswordSendOTP" element={<ResetPasswordSendOTP/>}/>
        <Route path="/editRequest/:id" element={<EditRequest/>}/>
        <Route path="/editSearchPlatFormMaster/:id" element={<EditSearchPlatFormMaster/>}/>
        <Route path="/editStatusMaster/:id" element={<EditStatusMaster/>}/>
        <Route path="/editServiceType/:id" element={<EditServiceType/>}/>
        <Route path="/editSourceTarget/:id" element={<EditSourceTarget/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/userProfile" element={<UserProfile/>}/>
        <Route path="/verifyUserLoginOTP/:email" element={<VerifyUserLoginOTP/>}/>
       
      </Routes>
      </BrowserRouter>
        
  );
}

export default App;
