import React from 'react';
import ViewKeysDetails from './ViewKeysDetails';
import image from '../icons/pdf-1.svg';
import csv from '../icons/csv.svg';
import schedule from '../icons/schedule.svg';
import warning from '../icons/warning.svg';
import brokenkey from '../icons/BrokenKey.svg';
import questionmark from '../icons/questionmark.svg';
import csv1 from '../icons/csv1.svg';
import shopping from '../icons/shoppingcart.svg';
import axiosInstance , {baseURL} from '../../api/api';
import  jsPDF from "jspdf";
import 'jspdf-autotable';
import cancel from '../icons/cancel.svg';
import { autoTable } from 'jspdf-autotable';
import { CSVLink } from "react-csv";
import { Paginator } from 'primereact/paginator';
import Select from "react-select";
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import Modal from 'react-modal';
import KeyRequest from './KeyRequest';
import { Toast } from 'primereact/toast';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;
interface Props{
  edit:boolean;
  data:any;
  view:any;
  currentuser:any;
  showDetails: any;
  isSelected:any;
  file:any;
  limit:any;
  offset:any;
  totalRecords:any;
  loading : boolean;
  modalIsOpen : boolean;
  door_compromised:any;
  csvTable:any;
}

class ViewKeys extends React.Component<{},Props> {
  toast: React.RefObject<any>;

  constructor(props:Props){
    super(props);
    this.toast = React.createRef();

    this.state={
      showDetails: false,
      edit:false,
      data:[],
      view:[],
      csvTable:[],
      currentuser:[],
      isSelected: '',
      file:[] as any,
      loading : false,
      modalIsOpen:false,
      door_compromised:'',

      limit:10,
      offset: null,
      totalRecords:null
    }}
    
    customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-20%',
        transform             : 'translate(-50%, -50%)',
        width                 : '50rem',
        height                : '37.5rem'
      }
    };

    /* exportPDF = async() => {

      try {
        this.setState({loading : true});
        const api = `kdfinder/keys/all/?file_number=${this.state.isSelected}`;
        let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
      const unit = "pt";
      const size = "A4"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);
      doc.setFontSize(15);
  
      const title = "View Keys";
      const headers = [["Key ID Stamp", "Key Description","QTY Cut"]];
      const data = response.data.data.map((item:any)=> [item.key_id, item.key_description,item.quantity]);
  
      let content = {
        startY: 50,
        head: headers,
        body: data
      };
      doc.text(title, marginLeft, 40);
      (doc as jsPDF & { autoTable: autoTable }).autoTable (content);
      doc.save("report.pdf");
      this.setState({loading : false});
    }catch(error){
      this.setState({loading : false});
        throw error;
    }
    }; */


    /* exportPDFsequence = (sequence:any) => {
      const unit = "pt";
      const size = "A4"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);
      doc.setFontSize(15);
  
      const title = "View Keys";
      const headers = [["Key ID Stamp", "Tenant","First/Last Name","Phone","Email ID","Issue Date"]];
      const data = sequence.map((item:any)=> [item.key_id, item.tenant_location, item.key_holder, item.phone, item.email, item.date_issued]);
  
      let content = {
        startY: 50,
        head: headers,
        body: data
      };
      doc.text(title, marginLeft, 40);
      (doc as jsPDF & { autoTable: autoTable }).autoTable (content);
      doc.save("sequence.pdf");
    }; */
   
    fetchedData= async(offset:any,limit:any,fn:any) => {
      try {
        this.setState({loading : true});
        const api = `/api/kdfinder/keys/?file_number=${fn}&limit=${limit}&offset=${offset}`;
        let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
        this.setState({data:response.data.results.data.map((obj:any)=>{
          return({...obj, showDetails: false
          })
        })});
        if(!(this.state.data.length === 0))
                {
                    this.setState({loading : false});
                }else {
                  this.setState({loading : false});
                  this.toast.current.show({severity: 'error',  detail: 'No record found'});
                }
        this.setState({currentuser:response.data.results.current_user});
        this.setState({totalRecords:response.data.count});
        this.setState({file:response.data.results.file_numbers.map((item: any)=>{ 
          return (
          { label: item.file_number, value: item.id})
        })});
        if(this.state.isSelected===''){
          this.setState({isSelected:response.data.results.selected});
        }
        return this.state.data;
    }catch(error){
      this.setState({loading : false});
        throw error;
    }
    }

    

  componentDidMount = () =>{
       this.fetchedData(null,null,'all');
    }

  details=(item:any,id1:any)=> {
    //this.setState({loading:true});
    const updatedData = this.state.data.map((obj:any,i:number)=>{
      if(i===id1){
        obj.showDetails = true;
      }else{
        obj.showDetails = false;
      }
      return {...obj}
      });
   this.setState({data:updatedData});
   this.setState({edit:true});
   this.setState({view:item.sequence});
   this.setState({door_compromised: item.door_compromised});
  }

  colourStyles ={
    option: (provided:any) => ({
      ...provided,
      backgroundColor: this.state.isSelected ? 'white' : 'white',
      cursor: 'pointer',
      color: this.state.isSelected ? 'black' : 'black',
      "&:hover": {
        backgroundColor: "#ccc"
      }
    }),
    control: (styles:any) => ({
      ...styles,
      cursor: 'pointer',
      
    }),
  }
   
  handleChange = (e:any) => {
    this.fetchedData(null,null,e.label);
    this.setState({isSelected:e.label});
  }

  cancel(id:any) {
    const updatedData = this.state.data.map((obj:any,i:number)=>{
        if(i===id){
          obj.showDetails = false;
        }
        return {...obj}
    })
    this.setState({data: updatedData,edit:false});
    this.fetchedData(null,null,'all');
   }

   load = ()=>{
    this.setState({loading:false});
   }
   
   loadc = ()=>{
    this.setState({loading:true});
   }
  renderEditForm=(show:any,id:any)=>{
    if(show){
      return(
        <>
          <tr style={{height:"0px"}}>
              <td colSpan={4}>
              <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Key Holder Informations</p>
                            </div>
                            <div className="col-6">
                                    <span className="detail-created" onClick={()=>this.cancel(id)} >Close</span>
                                </div>
                        </div>
                    </div>
                </div>
                <ViewKeysDetails loadc={this.loadc} load={this.load} viewdata={this.state.view}/>
              </td>
          </tr>
       </>
      )
    }
  }   

  renderEdit=()=>{
    if(this.state.edit){
      return(
        <>
       <div className="row">
            <div className="col-2" style={{marginTop:"1.25rem",marginRight:"1.875rem",marginLeft:"-2.5rem",width:'65%'}}>
               <img alt="warning" src={warning}/><br></br><span>{this.state.door_compromised} Door Compromised</span>
            </div>
            <button style={{marginTop:"1.25rem",marginLeft:"0.938rem", height:"3.875rem",width:"9.063rem"}}  type="button" className="btn btn-outline-info"><img style={{marginTop:"0.438rem",marginRight:"0.5rem",width:'32%'}} alt="schedule" src={schedule}/>Schedule<span style={{marginTop:"-1.125rem",marginRight:"-2.25rem",display:"block"}}> Service</span></button>
            <a href={`${baseURL}/api/kdfinder/csv/key-qty/${this.state.currentuser.id}/${this.state.isSelected}/`} style={{marginTop:"1.25rem",marginLeft:"0.938rem",height:"3.875rem",width:"10.25rem"}} 
                  className="btn btn-outline-success">
                  <img style={{marginTop:"0.438rem",marginRight:"0.5rem",marginLeft:"-.25rem",width:'20%'}} alt="csv" src={csv}/>
                  Export System <span style={{marginTop:"-1.125rem",marginRight:"2.25rem",display:"block"}}>CSV </span>
            </a>
            <a href={`${baseURL}/api/kdfinder/pdf/key-qty/${this.state.currentuser.id}/${this.state.isSelected}/`} style={{marginTop:"1.25rem",marginLeft:"0.938rem",marginRight:"-3.125rem",height:"3.875rem",width:"11.813rem"}} type="button" className="btn btn-outline-danger"><img style={{marginTop:"0.438rem",marginRight:"1px",marginLeft:"-1px",width:'17%'}} alt="pdf" src={image}/> Download System<span style={{marginTop:"-1.125rem",marginRight:"3.875rem",display:"block"}}> PDF</span></a>                   
        </div>
       </>
      )
    }else{
      return(
        <>
        <div className="row">
          <div>
            <button style={{marginTop:"1.25rem",marginLeft:"0.938rem", height:"3.875rem",width:"9.063rem"}} type="button" className="btn btn-outline-info"><img style={{marginTop:"0.438rem",marginRight:".5rem",width:'32%'}} alt="schedule" src={schedule}/>Schedule<span style={{marginTop:"-1.125rem",marginRight:"-2.25rem",display:"block"}}> Service</span></button>
            <a href={`${baseURL}/api/kdfinder/csv/key-qty/${this.state.currentuser.id}/${this.state.isSelected}/`} style={{marginTop:"1.25rem",marginLeft:"0.938rem",height:"3.875rem",width:"10.25rem"}} 
                   className="btn btn-outline-success">
                  <img style={{marginTop:"0.438rem",marginRight:"0.5rem",marginLeft:"-.25rem",width:'20%'}} alt="csv" src={csv}/>
                  Export System <span style={{marginTop:"-1.125rem",marginRight:"2.25rem",display:"block"}}>CSV </span>
            </a>
            <a href={`${baseURL}/api/kdfinder/pdf/key-qty/${this.state.currentuser.id}/${this.state.isSelected}/`} style={{marginTop:"1.25rem",marginLeft:"0.938rem",marginRight:"-4.688rem",height:"3.875rem",width:"11.813rem"}} type="button" className="btn btn-outline-danger"><img style={{marginTop:"0.438rem",marginRight:"1px",marginLeft:"-1px",width:'17%'}} alt="pdf" src={image}/> Download System<span style={{marginTop:"-1.125rem",marginRight:"3.875rem",display:"block"}}> PDF</span></a>  
             
          </div>
          <div className="col-4" style={{marginTop:"0.625rem",marginLeft:"27.5rem"}}>
                <Select
                    values={this.state.isSelected}
                    onChange={this.handleChange }
                    className="dropdown"
                    options={this.state.file}
                    placeholder={this.state.isSelected}
                    styles={this.colourStyles}
                    isSearchable
                />
          </div>
        </div>
        </>
      )
    }
  }   

  

  renderkeys=()=>{
    if(this.state.edit){
      return(
        <>
       <div style={{display:"block",float:"right",marginLeft:"-0.938rem",marginTop:"-0.625rem"}}>
              <img alt="broken" style={{width:'1rem'}} src={brokenkey}/><span style={{marginLeft:"0.75rem",color:"#0D93C9"}}>Broken key</span>
              <img alt="questionmark" style={{marginLeft:"1rem",width:'0.6rem'}} src={questionmark}/><span style={{marginLeft:"0.75rem",marginRight:"2.5rem",color:"#FF6B6B"}}>Key Lost</span>
        </div>
       </>
      )
    }else{
      return(
        <>
        </>
      )
    }
  }   

  modal = () =>{
    this.setState({modalIsOpen:false});
  }

  addToast=(mes:any)=>{
    this.toast.current.show({severity: 'success', detail: mes});
  }
  changeModal = () =>{
    this.setState({modalIsOpen:false});
  }

  renderModal = () =>{
    return( 
      <>
      <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
                </div>
    <KeyRequest modal={this.modal}  addtoast={this.addToast} />
    </>
    )
  }

  request = () => {
    this.setState({modalIsOpen:true});
  }

  onPageChange = (event:any) => {
    this.setState({offset:event.first,limit:event.rows});
    this.fetchedData(event.first,event.rows,this.state.isSelected);
}

closeModal = () =>{
  this.setState({modalIsOpen:false});
}
  
  
  render(){
    
  const lastLoginDate  = this.state.currentuser.last_login? new Date(this.state.currentuser.last_login).toLocaleDateString(): '';
  const lastUpdatedDate = this.state.currentuser.last_modified? new Date(this.state.currentuser.last_modified).toLocaleDateString(): "";

      return (
        <>
          <div>
          {
            this.state.loading  ? <div className='overlay-box1'>
            <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
        </div> :''
          }
          <Toast ref={this.toast} />
                <Modal style={this.customStyles} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>{this.renderModal()}</Modal>
            <div className="upper1" >
              <div className="row">
                  <div style={{marginTop:"0.6rem",marginLeft:"1.25rem"}} className="col-4">
                      <p><span style={{color:"#009DD0",fontSize:"1.5rem"}}><span style={{fontWeight:"bold", marginRight:".6rem"}}>Welcome</span>{this.state.currentuser.first_name} {this.state.currentuser.last_name}</span></p>
                      <p> Your last log in was on :  <strong>{lastLoginDate}</strong></p>
                      <p>Last Updated:  <strong>{lastUpdatedDate}</strong></p>
                  </div>   
                  <div className="col-8" style={{marginLeft:"22.5rem",marginTop:"-9.375rem"}}>
                    {this.renderEdit()}
                    {this.renderkeys()}
                    
                  </div> 
              </div>
            </div>
            <div className="content" >
          <table className="table" style={{backgroundColor:"#fff"}}>
            <thead style={{ color: "#fff",backgroundColor:"#12739A" }}>
              <tr>
                <th data-visible="true" >Key ID Stamp</th>
                <th>Key Description</th>
                <th>QTY Cut</th>
                <th style={{textAlign:"right"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
            {this.state.data.map((item: any,i: any)=>{
             return(
               <>
              <tr key={i}>
                <td><span onClick={()=>this.details(item,i)} style={{cursor:"pointer",color:"#009ED6",textDecoration:"underline"}}>{item.key_id}</span></td>
                <td>{item.key_description}</td>
                <td>{item.quantity}</td>
                <td style={{textAlign:"right"}}>
                  <img alt="keyrequest" style={{marginLeft:"0.938rem",cursor:"pointer",width:'1.5rem'}} onClick={this.request} src={shopping}/>
                  {<a href={`${baseURL}/api/kdfinder/csv/key-sequence/${this.state.currentuser.id}/${this.state.isSelected}/${item.id}/`} ><img alt="csv1" style={{marginLeft:"0.938rem",cursor:"pointer",width:'1.3rem'}} src={csv1}/></a>}
                  {<a href={`${baseURL}/api/kdfinder/pdf/key-sequence/${this.state.currentuser.id}/${this.state.isSelected}/${item.id}/`} ><img alt="pdf1" style={{marginLeft:"0.938rem",cursor:"pointer",width:'1.3rem'}} src={image}/></a>}

                </td>
              </tr>
             
                   {this.renderEditForm(item.showDetails,i)}
                
              </>
              )})}
            </tbody>
            <tr>
                 <td colSpan={6}>
                  <Paginator first={this.state.offset} rows={this.state.limit} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10, 20, 30]} 
                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                  onPageChange={this.onPageChange}></Paginator>
                  </td>
                  </tr>
            </table>
            </div>
          </div>
        </>
      );
    }
  }


export default ViewKeys;  