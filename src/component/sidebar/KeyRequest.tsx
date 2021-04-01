import React from 'react';
import key1 from '../icons/Group966.svg';
import key2 from '../icons/Group1036.svg';
import key3 from '../icons/Group1037.svg';
import key4 from '../icons/Group1038.svg';
import key5 from '../icons/Group1039.svg';
import minus from '../icons/minus.svg';
import logolocks from '../icons/logolocks1.png';
import axiosInstance from '../../api/api';
import { Toast } from 'primereact/toast';
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";
import Select from "react-select";

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:60%;
  margin-left: 20%;
`;

const validEmailRegex = RegExp(
    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  );


interface Props {
    option:any;
    [key: string]: any;
}

class KeyRequest extends React.Component<{modal:any, addtoast:any,keyCode: any},Props> {
    toast: React.RefObject<any>;
    constructor(props:any){
        super(props);
        console.log(props)
        this.toast = React.createRef();
        this.state={
          option:'',
          pickupPerson:'',
          company:'',
          companies: [],
          phone: localStorage.getItem('phone'),
          email: localStorage.getItem('email'),
          address:'',
          authcusname: localStorage.getItem('username'),
          orderno:'',
          keys : [{quantity: 0, key_code: this.props.keyCode, brand: "Mul-T-Lock"}],
          image:null,
          imageLabel:[],
          loading:false,
          datasetId:0,
        }
    }
    
    componentDidMount = () => {
      this.getCompanies()
    }

    options = [
      { value: 'pending', label: 'Open' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'rejected', label: 'Rejected' },
    ];

    getCompanies = () => {
      axiosInstance
        .get(`/api/customer/company/details/`).then(res => {
            this.setState({companies: res.data.data.map((obj: any) => {
              return  {label: obj.location, value: obj.location_no,address:obj.address}
            } )});
        })
    }

    handleNumber = (e:any) =>{
        this.setState({quantity: e.target.value});
     }

     handleInputChange = (e:any) => {
        if (["quantity", "key_code", "brand"].includes(e.target.name)) {
            let keys = [...this.state.keys]
            keys[e.target.dataset.id][e.target.name] = e.target.value;
            this.setState({datasetId : e.target.dataset.id});
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
   
     handleChangeRadio = (e:any) =>{
         this.setState({option: e.target.value});
     }

     addNewRow = () => {
        this.setState((prevState) => ({
            keys: [...prevState.keys, { quantity: 0, key_code: "", brand: "Mul-T-Lock" }],
        }));
    }

    deteteRow = (index:any) => {
        this.setState({
            keys: this.state.keys.filter((s:any, sindex:any) => index !== sindex),
        });
        // const taskList1 = [...this.state.taskList];
        // taskList1.splice(index, 1);
        // this.setState({ taskList: taskList1 });
    }

    clickOnDelete(record:any) {
        this.setState({
            keys: this.state.keys.filter((r:any) => r !== record)
        });
    }

    formValidation = () =>{
        let isValid = true;
        let numbers = /[0-9]/g;
         if(this.state.company === ''){
             
                this.toast.current.show({severity: 'error',  detail: "Please enter company"});
                
            isValid = false;
         }else if(this.state.address === ''){
            
                this.toast.current.show({severity: 'error',  detail: "Please enter address"});
                
            isValid = false;
         }else if(this.state.email=== ''){
            
                this.toast.current.show({severity: 'error',  detail: "Please enter Email Address"});
                
            isValid = false ;
        }else if(!validEmailRegex.test(this.state.email)){
            
                this.toast.current.show({severity: 'error',  detail: "Please enter a valid Email Address"});
                
            isValid = false ;
        }else if(this.state.phone === ''){
            
                this.toast.current.show({severity: 'error',  detail: "Please enter Phone Number"});
                
            isValid = false ;
        }else if(!this.state.phone.match(numbers)){
            
                this.toast.current.show({severity: 'error',  detail: "Please enter a valid Phone Number"});
                
            isValid = false ;
        }else if(this.state.authcusname === ''){
            
            this.toast.current.show({severity: 'error',  detail: "Please enter Authorized customer name"});
            
        isValid = false ;
        }else if(this.state.orderno === ''){
            
            this.toast.current.show({severity: 'error',  detail: "Please enter Order number"});
            
        isValid = false ;
        }else if(this.state.keys.some((item:any) => item.quantity < 1)){
            
            this.toast.current.show({severity: 'error',  detail: "Please enter quantity"});
            
        isValid = false ;
        }else if(this.state.keys.some((item:any) => item.key_code === '')){
            
            this.toast.current.show({severity: 'error',  detail: "Please enter keyCode"});
            
        isValid = false ;
        }else if(this.state.option === ''){
            this.toast.current.show({severity: 'error',  detail: "Please choose your delivery method"});
            
        isValid = false ;
        }
        else if(this.state.option === 'pickup'){
            if(this.state.pickupPerson === '')
            {
                this.toast.current.show({severity: 'error',  detail: "Please enter pickup person name"});
                isValid = false ;
            }
        }
        return isValid
    }

    handleSubmit = (e:any) =>{
        e.preventDefault();
        /* console.log(this.state.image);
        const upload= this.state.image;
        const form = new FormData();
        form.append("file", upload); 
        console.log(form); */
          let isValid = this.formValidation();
        if(isValid){
            this.setState({loading:true});
        axiosInstance
        .post(`/api/kdfinder/key-request/`, {
            company: this.state.company,
            address: this.state.address,
            email: this.state.email,
            phone: this.state.phone,
            authorize_customer: this.state.authcusname,
            purchase_order: this.state.orderno,
            delivery_method: this.state.option,
            pickup_by: this.state.pickupPerson,
            key_request_quantity: this.state.keys,
        },{ headers: {
            'content-type': 'multipart/form-data'
          } }
        )
        .then((res) => {
            this.setState({loading:false});
            if(res.status===200)
            { 
                this.props.modal();
                this.props.addtoast('Request Sent');
             }else{
                this.props.modal();
                this.props.addtoast('Request not Sent');
            }
        })
        .catch((error)=>{
            this.setState({loading:false});
            this.toast.current.show({severity: 'error',  detail: "Wrong Details"});
            
        })
    }  
    }

    handleChangeLocation =  (opt:any, e:any) => {
      this.setState({company: opt.label, address: opt.address})
    }

    handleFile = (e:any) =>{
       /* let updated = [...this.state.image];
       updated.push(e.target.files[0]); */
       this.setState({image:e.target.files});

       let label = [...this.state.imageLabel];
       label.push(e.target.files[0].name);
       this.setState({imageLabel : label});
    }

   render(){
       return(
           <>
           <div>
               {
                   this.state.loading ? <div className='overlay-box3'>
                   <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
               </div> :''
               }
               <div>
               <Toast ref={this.toast} position="bottom-right"/> 
               </div>
               
          <div style={{textAlign:'center',marginBottom:'0.625rem'}}>
             <img style={{marginTop:"0.313rem"}} alt="logolocks" src={logolocks}/>
          </div>
            <div style={{backgroundColor:'#0D93C9', height:'2.5rem'}}> 
                <div className="col-12">
                    <div className="row">
                        <div className="col-6">
                            <p style={{color:"#fff",textAlign:"left",marginTop:"5px",fontSize:"1.125rem", fontWeight:400}}>High Security Key Request Form</p>
                        </div>
                    </div>
                </div>
            </div>
            <form style={{marginTop:"1.875rem"}}>
                <div className="row">
                    <div className="col m-2" >
                        <Select
                            onChange={this.handleChangeLocation}
                            className="dropdown "
                            options={this.state.companies}
                            placeholder={'Company'}
                        />
                    </div>
                    <div className="col m-2">
                        <input  name="phone" className="form-control"   placeholder="Phone*" value={this.state.phone}  onChange={this.handleInputChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col m-2">
                        <input  name="email" type="email"  className="form-control"  placeholder="Email Id*" value={this.state.email} onChange={this.handleInputChange}/>
                    </div>
                    <div className="col m-2">
                        <input  name="address" type="email"  className="form-control" value={this.state.address}  placeholder="Address*" onChange={this.handleInputChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col m-2">
                        <input  name="authcusname" className="form-control" value={this.state.authcusname}  placeholder="Authorized Customer Name*" onChange={this.handleInputChange}/>
                    </div>
                    <div className="col m-2">
                        <input  name="orderno" className="form-control"  placeholder="Purchased Order Number*" onChange={this.handleInputChange}/>
                    </div>
                </div>
            </form>
            <div style={{backgroundColor:'#0D93C9', height:'2.5rem',marginTop:'1.25rem'}}> 
                <div className="col-12">
                    <div className="row">
                        <div className="col-6">
                            <p style={{color:"#fff",textAlign:"left",marginTop:"5px",fontSize:"1.125rem", fontWeight:400}}>Marked the Brand of key you need cut</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                            <div className="row">
                                <div className="keycard" >
                                    <div className="form-check" style={{marginLeft:'0.25rem',marginTop:'0.5rem'}}>
                                      {/* <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem'}} type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked/> */}
                                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'0.313rem'}} >
                                      Mul-T-Lock
                                      </label>
                                    </div>
                                    <img style={{marginTop:"0.938rem",marginLeft:"1.25rem",width:'58%'}} alt="key1" src={key1}/>
                                </div>
                                <div className="keycard">
                                    <div className="form-check" style={{marginLeft:'0.25rem',marginTop:'0.5rem'}}>
                                      {/* <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem'}} type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/> */}
                                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'0.313rem'}} >
                                      Abloy
                                      </label>
                                    </div>
                                    <img style={{marginTop:"0.938rem",marginLeft:"1.25rem",width:'50%'}} alt="key2" src={key2}/>
                                </div>
                                <div className="keycard">
                                    <div className="form-check" style={{marginLeft:'0.25rem',marginTop:'0.5rem'}}>
                                      {/* <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem'}} type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/> */}
                                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'0.313rem'}} >
                                      Medeco X4
                                      </label>
                                    </div>
                                    <img style={{marginTop:"0.938rem",marginLeft:"1.25rem",width:'45%'}} alt="key3" src={key3}/>
                                </div>
                                <div className="keycard">
                                    <div className="form-check" style={{marginLeft:'0.25rem',marginTop:'0.5rem'}}>
                                      {/* <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem'}} type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/> */}
                                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'0.313rem'}} >
                                      Primus
                                      </label>
                                    </div>
                                    <img style={{marginTop:"0.938rem",marginLeft:"1.25rem",width:'58%'}} alt="key4" src={key4}/>
                                </div>
                                <div className="keycard">
                                    <div className="form-check" style={{marginLeft:'0.25rem',marginTop:'0.5rem'}}>
                                      {/* <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem'}} type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/> */}
                                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'0.313rem'}} >
                                      ZC
                                      </label>
                                    </div>
                                    <img style={{marginTop:"0.938rem",marginLeft:"1.25rem",width:'58%'}} alt="key5" src={key5}/>
                                </div>
                            </div>
                </div>
                <div style={{backgroundColor:'#0D93C9', height:'2.5rem',marginTop:'1.25rem',marginBottom:'1.25rem'}}> 
                  <div className="col-12">
                      <div className="row">
                          <div className="col-6">
                              <p style={{color:"#fff",textAlign:"left",marginTop:"5px",fontSize:"1.125rem", fontWeight:400}}>List of Quantity of each Key(s) you need cut</p>
                          </div>
                          <div className="col-6" >
                            <button data-toggle="tooltip" data-placement="top" title="add" style={{float:'right',backgroundColor:'rgb(13, 147, 201)', border:'rgb(13, 147, 201)'}} onClick={this.addNewRow} type="button" className="btn btn-primary text-center"><i style={{fontSize:'larger'}} className="fa fa-plus-circle" aria-hidden="true"></i></button>
                          </div>
                      </div>
                  </div>
               </div>
               <table className="table">
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Key Code #(Found on the Key Head)</th>
                            <th>Brand</th>
                        </tr>
                    </thead>
                    <tbody>{
                    this.state.keys.map((val:any, idx:any) => {
                        let quantity = `quantity-${idx}`, key_code = `key_code-${idx}`, brand = `brand-${idx}`
                        return (
                            <>
                            <tr>
                            <td style={{width:'8rem'}}>
                                <input type="number" min="0" className="form-control" data-id={idx} id={quantity} name='quantity' onChange={this.handleInputChange} />
                            </td>
                            <td style={{width:'20rem'}}>
                                <input type="text" className="form-control" name='key_code' value={val.key_code} data-id={idx} id={key_code} placeholder="key code" onChange={this.handleInputChange}/>
                            </td>
                            <td  style={{width:'12rem'}}>
                                 <select name="brand" id={brand} data-id={idx} style={{paddingRight:'10px'}} className="form-control" onChange={this.handleInputChange} placeholder='Selected Options'>
                                    <option value="Mul-T-Lock" >Mul-T-Lock</option>
                                    <option value="Abloy">Abloy</option>
                                    <option value="Medeco X4">Medeco X4</option>
                                    <option value="Primus">Primus</option>
                                    <option value="ZC">ZC</option>
                                </select>
                            </td>
                            <td>
                                {
                                idx===0? ''
                                : <img alt='minus' style={{width:'2rem',cursor:'pointer'}} src={minus}  onClick={(() => this.clickOnDelete(val))}/>
                                }
                            </td>
                            </tr>
                            </>
                        )
                                })
                       }
                    </tbody>
                </table>
                {/* <div style={{backgroundColor:'#0D93C9', height:'2.5rem',marginTop:'1.25rem',marginBottom:'1.25rem'}}> 
                  <div className="col-12">
                      <div className="row">
                          <div className="col-6">
                              <p style={{color:"#fff",textAlign:"left",marginTop:"5px",fontSize:"1.125rem", fontWeight:400}}>Add up to 2 images of each key</p>
                          </div>
                      </div>
                  </div>
               </div> */}
              {/*  <div>
                   <form >
                    <input accept="image/*" type="file" id="file" multiple hidden onChange={this.handleFile} />
                    <label className='uploadfile' htmlFor="file">Choose file</label>
                    </form>
                    <div>
                        {this.state.imageLabel.map((item:any)=>{
                            return (
                                <>
                                <span>{item}</span><br></br>
                                </>
                            )
                        })}
                    </div>
               </div> */}
                <div style={{backgroundColor:'#0D93C9', height:'2.5rem',marginTop:'1.25rem',marginBottom:'1.25rem'}}> 
                  <div className="col-12">
                      <div className="row">
                          <div className="col-6">
                              <p style={{color:"#fff",textAlign:"left",marginTop:"5px",fontSize:"1.125rem", fontWeight:400}}>Choose your method of delivery</p>
                          </div>
                      </div>
                  </div>
               </div> 
               <div className="row">
                 <div className="col-4">
                    <div className="form-check" style={{marginLeft:'1.5rem',marginTop:'.5rem'}}>
                      <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem',cursor:'pointer'}} type="radio" name="option" id="exampleRadios1" value="pickup" onChange={this.handleChangeRadio}  />
                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'5px',paddingTop:'0.25rem'}} htmlFor="exampleRadios1">
                      Pick Up
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-check" style={{marginLeft:'.25rem',marginTop:'.5rem'}}>
                      <input className="form-check-input" style={{width:'1.188rem',height:'1.188rem',cursor:'pointer'}} type="radio" name="option" id="exampleRadios2" value="courier" onChange={this.handleChangeRadio} />
                      <label className="form-check-label" style={{fontSize:'0.875rem', fontWeight:500, marginLeft:'5px',paddingTop:'0.25rem'}} htmlFor="exampleRadios2">
                      CLS Courier ($15.00)
                      </label>
                    </div>
                  </div>
               </div>
               <div>
               {  (this.state.option==='pickup') ?
                 <div style={{paddingTop:'1.5rem'}}>
                     <div className="form-group col-md-6">
                      <input type="text" className="form-control" name='pickupPerson' placeholder="Full Name of Person Picking Up Order*" onChange={this.handleInputChange}/>
                    </div>
                 </div>: ''
               }
               </div>
               <div  style={{marginTop:'30px',textAlign:'center'}}>
                 <button style={{backgroundColor:"#009ED6",width:"42.188rem", height:'2.5rem'}} className="btn btn-primary" type="submit" onClick={this.handleSubmit}>Submit Order</button>
              </div>
        </div>
           </>
       )
   }
}

export default KeyRequest;