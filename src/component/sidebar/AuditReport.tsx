import React from 'react';
import './CompanyDetails.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../api/api';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import { Toast } from 'primereact/toast';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;
interface Props{
  data:any;
  first_name:any;
  last_name:any;
  start_date:any;
  end_date:any;
  [key :string]:any;
  currentPage:any;
  rows:any;
  first:any;
  totalRecords:any;
  loading : boolean;
}
interface JQuery {
  DataTable():void;
}
class AuditReport extends React.Component<{},Props,JQuery> {
  toast: React.RefObject<any>;

   constructor(props:Props){
     super(props);
     this.toast = React.createRef();
     this.state={
       data:[],
       first_name:"",
       last_name:"",
       start_date:"",
       end_date:"",

       currentPage: null,
       totalPages: null,
       rows:10,
       totalRecords: null,
       first: null,
       loading : false,
     }
     
   }

   fetchedData = async(offset:any,limit:any) => {
     this.setState({first_name:"",
     last_name:"",
     start_date:"",
     end_date:"",});
    try {
      this.setState({loading : true});
      const api = `/api/customer/audit/?limit=${limit}&offset=${offset}`;
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
      this.setState({data:response.data.results});

      if(!(this.state.data === null))
        {
            this.setState({loading : false});
            
        }
      
      this.setState({totalRecords:response.data.count});
      this.setState({totalPages: Math.ceil(response.data.count/this.state.limit)})
      return this.state.data;
  }catch(error){
    this.setState({loading : false});
      throw error;
  }

   }

  componentDidMount= async()=>{
    this.fetchedData(null,null);
  }

    handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
    let name = e.target.name;
    let value = e.target.value;
    this.setState({[name]:value});
    
};

 formValidation = () =>{
  let isValid = true;
    if(this.state.first_name === '' && this.state.last_name === '' && this.state.start_date === '' && this.state.end_date===''){
      this.toast.current.show({severity: 'error',  detail: "Please Enter the fields"});
    }else if(!(this.state.first_name === '')){
       if(this.state.last_name===''){
        this.toast.current.show({severity: 'error',  detail: "Enter last name"});
        isValid = false;
       }
   }else if(!(this.state.last_name === '')){
          if(this.state.first_name===''){
            this.toast.current.show({severity: 'error',  detail: "Enter first name"});
            isValid = false;
          }
      
   }else if(!(this.state.start_date=== '')){
        if(this.state.end_date===''){
          this.toast.current.show({severity: 'error',  detail: "Please enter Last Date"});
          isValid = false ;
        }
  }else if(!(this.state.end_date==='')){
         if(this.state.start_date===''){
          this.toast.current.show({severity: 'error',  detail: "Please enter Start Date"});
          isValid = false ;
         }
  }
  return isValid
}

   handleSubmit = async() => {
    let isValid = this.formValidation();
        if(isValid){
    try {
      this.setState({loading : true});
      const api = `/api/customer/audit/?first_name=${this.state.first_name}&last_name=${this.state.last_name}&start_date=${this.state.start_date}&end_date=${this.state.end_date}`;
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
      if(response.data.count=== 0){
        this.setState({loading : false});
        this.toast.current.show({severity: 'error',  detail: "No data found"});
        this.setState({data:response.data.results});
      }else if(response.data.status===400){
        this.setState({loading : false});
        this.toast.current.show({severity: 'error',  detail: "User does not exist"});
      }else if(!(response.data.results===0)){
        this.setState({loading : false});
        this.toast.current.show({severity: 'success',  detail: "Successfully Searched"});
        this.setState({data:response.data.results});
        this.setState({totalRecords:response.data.count});
      }
      
      return this.state.data;
  }catch(error){
      this.setState({loading : false});
      this.toast.current.show({severity: 'error',  detail: "Status 500"});
      throw error;
  }
  }
  }


  onPageChange = (event:any) => {
    this.setState({first:event.first,rows:event.rows});
    this.fetchedData(event.first,event.rows);
}

  render() {
    
    return (
      <>
        <div>
          {this.state.loading ? <div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
                </div>:''}
        <Toast ref={this.toast} />
            <div className="upper1" style={{height:"12.5rem"}} >
            
              <div className="row" style={{padding:"1rem",paddingTop:'0.625rem'}} >
                  <div className="col-12">
                      <span style={{color:"grey",float:"left",fontWeight:"bold",fontSize:"1.25rem",padding:"0.3rem",paddingLeft:'0px'}}>Audit Trail</span>
                  </div>
                <div className="col-md-3 mb-3">
                  <label >Search by First Name</label>
                  <input type="text" name="first_name" className="form-control" placeholder="Enter First Name" value={this.state.first_name} onChange={this.handleInputChange}/>
                </div>
                <div className="col-md-3 mb-3">
                  <label >Search by Last Name</label>
                  <input type="text" name="last_name" className="form-control" placeholder="Enter Last Name" value={this.state.last_name} onChange={this.handleInputChange} />
                </div>
                <div className="col-md-3 mb-3">
                  <label >Start Date</label>
                  <Calendar id="basic" placeholder="DD/MM/YYYY" value={this.state.start_date} onChange={(e:any) => this.setState({start_date:e.value.toLocaleDateString("fr-CA")})}   showIcon/>
                </div>
                <div className="col-md-3 mb-3">
                  <label >End Date</label>
                  <Calendar id="basic" placeholder="DD/MM/YYYY" value={this.state.end_date} onChange={(e:any) => this.setState({end_date:e.value.toLocaleDateString("fr-CA")})}  showIcon/>
                </div>
                  <div className='row' style={{margin:0,padding:0}}>
                    <div className='col' style={{textAlign:'right'}}>
                      <button type="submit" style={{backgroundColor:"#009ED6",borderColor:"#009ED6",marginRight:'0.65rem'}}
                          className="btn btn-primary" onClick={()=> this.fetchedData(null,null)} >Reset</button>
                      <button type="submit" style={{backgroundColor:"#009ED6",borderColor:"#009ED6"}}
                          className="btn btn-primary" onClick={this.handleSubmit} >Search</button>
                    </div>
                  </div>
                </div>
              </div>
              
            <div className="content" style={{height:'21rem'}}> 
            <table id="MyTable" className="table" style={{backgroundColor:"#fff"}}>
            <thead style={{ color: "#fff",backgroundColor:"#12739A"}}>
              <tr>
                <th>User Name</th>
                <th>Modified Date</th>
                <th>Action Performed By User</th>
              </tr>
            </thead>
            <tbody className="table-bordered">
            {this.state.data.map((item: any,i: any)=>{
              let date = new Date(item.date).toLocaleDateString("fr-CA")
                return(
              <tr key={i}>
                <td>{item.username}</td>
                <td>{date}</td>
                <td>{item.modifications}</td>
              </tr>
                )})}
            </tbody> 
            <tr>
           <td colSpan={4}>
           <Paginator className="paginator" first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10, 20, 30]} 
                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink " 
                  onPageChange={this.onPageChange}  ></Paginator>
                  </td>
                  </tr>
          </table>
          </div>
        </div>
      </>
    );
  }
}

export default AuditReport;  