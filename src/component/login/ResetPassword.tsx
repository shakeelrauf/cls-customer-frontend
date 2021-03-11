import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import axiosInstance from '../../api/api';
import { Toast } from 'primereact/toast';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;

let ResetPassword = (props:any) =>{
     let tokenquery :any = new URLSearchParams(props.location.search).get("token");
     let history = useHistory();
     let toast:any = useRef(null);
     const initialFormData = Object.freeze({
        new_password: '',
        confirm_password: '',
     });
     const [formData, setFormData] = useState(initialFormData);
     let [loading, setLoading] = useState<any>(true);
     
     const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
         let name = e.target.name;
         let value = e.target.value;
         setFormData({...formData,[name]:value});
     };

     const passwordValid = () => {
        let isValid =  true;
        if(!(formData.new_password === formData.confirm_password)){
         toast.show({severity: 'error', detail: "Password Not Matched"});
         isValid = false;
        }
        return isValid
     }
 
     const handleSubmit = (e:any) => {
         e.preventDefault();
         const isValid = passwordValid();
         if(isValid){
            setLoading(true);
         let token = tokenquery;
         try{
             axiosInstance
             .post(`/api/customer/confirm/password/`, {
                new_password: formData.new_password,
                confirm_password: formData.confirm_password,
                token:token,
             })
             .then((res) => {
                  setLoading(false);
                   toast.show({severity: 'success', summary: 'Success Message', detail: 'Order submitted'});
                   setFormData({...formData,
                    new_password:'',confirm_password:""
                 });
                 history.push('/');
             });
         }catch(error){
            setLoading(false);
             throw error;
         }
        }
     }
    return(
        <div>
            {
                loading ? <div className='overlay-box1'  style={{margin:0}}>
                <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
             </div> :''
            }
            <Toast ref={(el) => toast = el} />
            <div className="d-flex justify-content-center own-login-container">
            
                <form onSubmit={handleSubmit} style={{marginTop:"4.375rem"}}> 
                    <div>
                      <label style={{fontSize:"1.875rem",textAlign:"center",marginBottom:"1.563rem"}}>Reset Password</label>
                    </div>
                    <div className="form-group">
                        <input name="new_password" style={{width:"22rem",height:"2.5rem"}} type="password" className="form-control"  placeholder="New Password" value={formData.new_password}  onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <input name="confirm_password" style={{width:"22rem",height:"2.5rem"}} type="password" className="form-control"  placeholder="Confirm New Password" value={formData.confirm_password}  onChange={handleInputChange}/>
                    </div>
                    <div>
                        <button style={{width:"22rem",height:"2.5rem",backgroundColor:"#009ED6"}} className="btn btn-primary" type="submit">Change</button>
                    </div>
                </form>
                
                </div>
        </div>
    )
}

export default ResetPassword;