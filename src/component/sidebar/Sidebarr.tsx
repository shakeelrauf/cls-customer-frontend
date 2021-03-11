import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav} from "react-bootstrap";
import './Sidebarr.css';
import accounting from '../icons/accounting.svg';
import quotation from '../icons/Quotation.svg';
import service from '../icons/service.svg';
import manage from '../icons/add-group.svg';
import audit from '../icons/audit.svg';
import keys from '../icons/keys.svg';
import company from '../icons/company.svg';
import axiosInstance from '../../api/api';
import { Link, NavLink, useHistory } from 'react-router-dom';
import logouticon from '../icons/log-out.svg';

let Sidebarr =()=> {
    const history = useHistory();
    const [username, setUsername] = useState<any>('');

     const logout =()=> {
        try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            axiosInstance.defaults.headers['Authorization'] = null;
            history.push('/');
        }
        catch (e) {
            console.log(e);
        }
    };
    useEffect(()=>{
        let username = localStorage.getItem('username');
        setUsername(username);
    },[]);

   

    const changepassword = () =>{
        history.push('/changepassword');
    }
    
      return (
        <>
        <div>
        <Nav className="col-md-12 d-none d-md-block sidebar">
        <div className="sidebarhead">Welcome <p style={{textAlign:"center"}}>{username}</p> </div>
               <hr className='line' />
                { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')   ? <span className="sidetext" style={{cursor:'not-allowed'}} ><img className='sideicons' alt="sidebar" src={accounting}/>
                    <span className='linktext'>Pay Bills</span></span> : <NavLink className="sidetext"  to="/home/accounting" ><img className='sideicons' alt="sidebar" src={accounting}/>
                    <span className='linktext'>Pay Bills</span></NavLink>}
                { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')  ? <span className="sidetext" style={{cursor:'not-allowed'}} ><img className='sideicons' alt="sidebar" src={quotation}/>
                    <span className='linktext'>Quotations</span></span> : <NavLink className="sidetext" to="/home/quotations" ><img className='sideicons' alt="sidebar" src={quotation}/>
                    <span className='linktext'>Quotations</span></NavLink>}
                <NavLink className="sidetext" to="/home/servicerequest"><img className='sideicons' alt="sidebar" src={service}/>
                    <span className='linktext'>Request Service</span></NavLink>
                { localStorage.getItem('key_finder')=== 'true'?<NavLink className="sidetext" to="/home/viewkeys"><img className='sideicons' alt="sidebar" src={keys}/>
                    <span className='linktext'>Manage Keys</span></NavLink> : <span className="sidetext" style={{cursor:'not-allowed'}}><img className='sideicons' alt="sidebar" src={keys}/>
                    <span className='linktext'>Manage Keys</span></span>}
                { localStorage.getItem('audit')=== 'true'? <NavLink className="sidetext" to="/home/auditreport"><img className='sideicons' alt="sidebar" src={audit}/>
                    <span className='linktext'>Audit Trail</span></NavLink> : <span className="sidetext" style={{cursor:'not-allowed'}}><img className='sideicons' alt="sidebar" src={audit}/>
                    <span className='linktext'>Audit Trail</span></span>}
                <NavLink className="sidetext"  to="/home/companydetails" ><img className='sideicons' alt="sidebar" src={company}/>                
                    <span className='linktext'>Company Locations</span></NavLink>
                <NavLink className="sidetext" to="/home/manageuser"><img className='sideicons' alt="sidebar" src={manage}/>
                    <span className='linktext'>Manage Users</span></NavLink>
                { (localStorage.getItem('user_type')=== 'primary') ? <NavLink className="sidetext" to="/home/systemnumber"><img className='sideicons' alt="sidebar" src={manage}/>
                    <span className='linktext'>System Number</span></NavLink> : ''}
                
                    <div>
                        <span style={{marginTop:"0.625rem",marginRight:"3.125rem",marginBottom:'1.25rem',fontSize:'1rem'}} className="detail-created" onClick={()=>changepassword()}>Change Password</span>
                        <hr className='line' />
                        <span style={{marginTop:".5rem",marginRight:"4rem",marginBottom:'.4rem'}} className="detail-created" onClick={()=>logout()}><img style={{float:"left",marginRight:"1rem",width:'1.5rem'}} alt="sidebar" src={logouticon}/>Logout</span>
                    </div>
                
            
        </Nav>      
         </div>
        </>
      );
    }
  

export default Sidebarr;  