import { useState } from 'react';
import axiosInstance from '../../api/api';
import './Login.css';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import { useHistory } from 'react-router';
import info from '../icons/info.svg';
import ReactTooltip from 'react-tooltip';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:35%;
  margin-left:-15%;
`;

let Login=()=> {
    let history = useHistory();
    const toast:any = useRef(null);

    const initialFormData = Object.freeze({
		oldpassword: '',
        newpassword: ''
    });
    const [formData, setFormData] = useState(initialFormData);
    let [loading, setLoading] = useState<any>(false);
    const [success, setSuccess] = useState<any>(false);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
        let name = e.target.name;
        let value = e.target.value;
        setFormData({...formData,[name]:value});
    };

    const formValidation= () =>{
        let isValid = true;
        const node = toast.current;
        let numbers = /[0-9]/g;
        let lowerCaseLetters = /[a-z]/g;
        let upperCaseLetters = /[A-Z]/g;
        let specialcharacter = /[!+@#\$%\^&\*]/g;
        if(formData.oldpassword === '' || formData.newpassword === ''){
            if(node){
            node.show({severity: 'error', detail: "Please Enter all fields"});
            }
            isValid = false ;
        }else if(!(formData.oldpassword.trim().length >= 8 && formData.oldpassword.match(numbers) && formData.oldpassword.match(lowerCaseLetters) && formData.oldpassword.match(upperCaseLetters) && formData.oldpassword.match(specialcharacter))){
            if(node){
                node.show({severity: 'error',  detail: "Please enter a valid old password format"});
                }
            isValid = false;
        }else if(!(formData.newpassword.trim().length >= 8 && formData.newpassword.match(numbers) && formData.newpassword.match(lowerCaseLetters) && formData.newpassword.match(upperCaseLetters) && formData.newpassword.match(specialcharacter))){
            if(node){
                node.show({severity: 'error',  detail: "Please enter a valid new password format"});
                }
            isValid = false;
        }
        return isValid
    }

  
    const handleSubmit = (e:any) => {
        e.preventDefault();
        let isValid = formValidation();
        if(isValid){
        setLoading(true);
        try{
        axiosInstance
			.patch(`/api/customer/change/password/`, {
				old_password: formData.oldpassword,
				password: formData.newpassword,
            },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
			.then((res) => {
                setLoading(false);
                if(res.data.status===200){
                    toast.current.show({severity: 'success', detail: 'Password Changed'});
                    setSuccess(true);
                }else
                    if(res.data.status===406){
                        toast.current.show({severity: 'error', detail: "Password should be minimum 8 characters with one upper,one special character, one lower case and one numeric value"});
                    }else if(res.data.status===400){
                        toast.current.show({severity: 'error', detail: "New password should not be the same as old password"});
                    }else{
                        toast.current.show({severity: 'error', detail: "Old password is Wrong"});
                    } 
                setFormData({...formData, oldpassword:'', newpassword:''});
                  
               })
               .catch((err)=>{
                setLoading(false);
                toast.current.show({severity: 'error', detail: "Something went Wrong"});
               })
        }catch(error){
            setLoading(false);
            toast.current.show({severity: 'error', detail: "Something went Wrong"});
            throw error;
        }
    }
    }
    const passSuccess = () =>{
        history.push('/');
    }
       
      return (
        <div >
            <Toast ref={toast} />
            {
                loading ? <div className='overlay-box1' style={{margin:0}}>
                <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
             </div> : ''
            }
            <ReactTooltip id="required"effect="solid" place="bottom" >
           "Password should be minimum 8 characters with atleast one uppercase, one lowercase, one special character and one numeric value"
        </ReactTooltip>
            {success ? <div className="d-flex justify-content-center own-change-container">
                <div style={{marginTop:'15rem'}}>
                <p style={{fontSize:'1.25rem'}}>Password changed Successfully!</p>
                <button type="submit" onClick={passSuccess} className='btn btn-primary'>Go to login page </button>
                </div>
            </div>
            :
            <div className="d-flex justify-content-center own-change-container">
            <form onSubmit={handleSubmit} style={{marginTop:"6.375rem"}}> 
                <div>
                  <label style={{fontSize:"1.875rem",textAlign:"center",marginBottom:"1.563rem"}}>Change Password</label>
                </div>
                <div className="form-group">
                    <input name="oldpassword" style={{width:"22.063rem",height:"2.5rem"}} type="password" value={formData.oldpassword} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Old Password*" onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                <div className="row" style={{marginLeft:"0px"}}>
                    <input name="newpassword" style={{width:"22.063rem",height:"2.5rem",paddingRight:'2.2rem'}} type="password" value={formData.newpassword} className="form-control" id="exampleInputPassword1" placeholder="New Password*" onChange={handleInputChange}/>
                    <img alt="info" data-for="required" data-tip="required" style={{cursor:"pointer", width:'1.25rem',padding:'0px',marginLeft:'-1.875rem'}} src={info}/>
                    </div>
                </div>
                <div>
                    <button style={{width:"22.063rem",height:"2.5rem",backgroundColor:"#009ED6"}} className="btn btn-primary" type="submit">Change</button>
                </div>
            </form>
            </div>
            }
            
            </div> 
      );
    }

export default Login;  