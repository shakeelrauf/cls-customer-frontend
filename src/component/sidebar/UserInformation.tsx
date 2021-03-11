import React from 'react';
import { useHistory } from 'react-router-dom';
import edit from '../icons/edit.svg';

let UserInformation =()=> {
  let history = useHistory();

   function login() {
    history.push(`/home/edituserinformation`);

   }
      return (
        <>
        <div className="container">
          <div style={{height:"545px"}} className="content" >
          <div className="accordian"> 
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                    <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>User Details</p>
                </div>
                <div className="col-6">
                <span className="detail-created" onClick={login}><img style={{marginRight:"8px"}} alt="save" src={edit} />Edit</span>
                </div>
              </div>
            </div>
          </div><br/>
          <div className="col-12">
            <div className="row">
                <div className="col-2">
                   <label><strong>Name</strong></label>
                   <p>Tim Hortons</p>
                </div>
                <div className="col-2">
                   <label><strong>File Number</strong></label>
                   <p>306-686-7832</p>
                </div>
                <div className="col-2">
                   <label><strong>User EmailID</strong></label>
                   <p>user@gmail.com</p>
                </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row">
                <div className="col-2">
                   <label ><strong>Address</strong></label>
                   <p>1941 Terry fox Dr</p>
                </div>
                <div className="col-2">
                   <label><strong>City</strong></label>
                   <p>Fond Du Lac</p>
                </div>
                <div className="col-2">
                   <label><strong>Province</strong></label>
                   <p>Saskatchewan</p>
                </div>
                <div className="col-2">
                   <label><strong>Postal Code</strong></label>
                   <p>S4P 3Y2</p>
                </div>
            </div>
          </div>
        </div>
        </div>
        </>
      );
    }


export default UserInformation;  