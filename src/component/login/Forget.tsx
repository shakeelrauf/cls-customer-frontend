import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {baseURL} from '../../api/api';
import axiosInstance from '../../api/api';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";

const validEmailRegex = RegExp(
    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  );

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;

let Forget = () =>{
    let history = useHistory();
    const toast:any = useRef(null);
    const initialFormData = Object.freeze({
		email: '',
    });
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
        let name = e.target.name;
        let value = e.target.value;
        setFormData({...formData,[name]:value});
    };

    const formValidation = () =>{
        let isValid = true;
        if(formData.email === ''){
                toast.current.show({severity: 'error', detail: "Please enter a email address"});
            isValid = false;
         }else
         if(!validEmailRegex.test(formData.email)){
            toast.current.show({severity: 'error', detail: "Please enter a valid email address"});
            isValid = false ;
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
			.post(`/api/customer/reset/password/`, {
				email: formData.email,
			})
			.then((res) => {
                setLoading(false);
                if(res.data.status === 200){
                toast.current.show({severity: 'success', detail: 'Mail sent'});
                 setFormData({...formData, email:'' });
               }else {
                toast.current.show({severity: 'error', detail: 'The Email address is not registered to an account'});
               }
            })
            .catch((error)=>{
                toast.current.show({severity: 'error', detail: 'Error'});
                setLoading(false);
            })
        }catch(error){
            throw error;
        }
    }
    }

    function login() {
        history.push(`/`);
       }
    return(
        <>
         <div >
         {
            loading ? <div className='overlay-box1' style={{margin:0}}>
            <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
         </div> :''
        }
         <Toast ref={toast} />
            <div className="d-flex justify-content-center own-login-container">
            <form onSubmit={handleSubmit}  style={{marginTop:"100px"}}> 
                <div>
                  <label style={{fontSize:"1.875rem",textAlign:"center",marginBottom:"1.563rem"}}>Forgot your Password?</label>
                </div>
                <div>
                  <label style={{fontSize:"1.125rem",textAlign:"center",marginBottom:"1.563rem"}}>Confirm your email and we'll send the Instructions</label>
                </div>
                <div className="form-group">
                    <div className="col">
                        <input  name="email" style={{width:"22rem",height:"2.5rem",marginLeft:'.5rem'}} className="form-control"  placeholder="Email ID *" value={formData.email} onChange={handleInputChange}/>
                    </div><br></br>
                    <div className="col">
                        <button style={{width:"22rem",height:"2.5rem",backgroundColor:"#009ED6",borderColor:"#009ED6"}} className="btn btn-primary" type="submit">Reset Password</button>
                    </div>
                </div>
                <div > 
                    <label style={{marginTop:"2.5rem",paddingLeft:'6.25rem'}}>
                       Do have an account?
                    </label>
                    <label className="create" onClick={login}  style={{marginLeft:"16.25rem",marginTop:"-2rem",fontSize:"1rem",color:"#009ED6",fontWeight:"bold"}}>
                       Login 
                    </label>
                </div>
            </form>
            </div>
            </div> 
        </>
    )
}
export default Forget;