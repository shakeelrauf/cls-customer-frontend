import React from 'react';
import axiosInstance from '../../api/api';
import tick from '../icons/tick.svg';
import cross from '../icons/cross.svg';
import edit1 from '../icons/edit.svg';
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

interface Props{
   data:any;
   loading :boolean;
   file_number:any;
   location:any;
   cus_no:any;
   last_name:any;
}
class SystemNumber extends React.Component<{},Props> {
  toast: React.RefObject<any>;
    constructor(props:any){
        super(props);
        this.toast = React.createRef();
        this.state={
            data:[],
            loading:false, 
            file_number:'',
            location:'',
            cus_no:'',
            last_name:'',
        }
    }
    

   fetchedData = async() => {
   try {
     this.setState({loading : true});
     const api = `/api/customer/file-numbers/`;
     let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
     this.setState({data:response.data.data, last_name: response.data.last_name, cus_no: response.data.cus_no});

     if(!(this.state.data.lenght === 0))
       {
           this.setState({loading : false});
       }else {
        this.setState({loading : false});
        this.toast.current.show({severity: 'error',  detail: 'No record found'});

      }
     return this.state.data;
 }catch(error){
   this.setState({loading : false});
     throw error;
 }

  }

 componentDidMount= async()=>{
  this.fetchedData();
 }


 onUpdate = (e:any,id:any)=>{
    e.preventDefault();
    this.setState({loading:true});
    axiosInstance
      .patch(`/api/customer/file-numbers/${id}/`, {
               location : this.state.location,
            },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
      .then((res) => {
          this.setState({loading:false});
          if((res.data.status)===200){
             const updatedData = this.state.data.map((obj:any,i:number)=>{
                if((obj.id)===id){
                    obj.location = this.state.location;
                    obj.editData = false;
                } 
                return ({...obj})
               })
        this.setState({data :updatedData});
        let node = this.toast.current;
          if(node){
            node.show({severity: 'success',  detail: 'Location updated successfully'});
        }
      }else {
        let node = this.toast.current;
          if(node){
            node.show({severity: 'error',  detail: 'Something went wrong'});
        }
      } 
      });
  
   }

 onEdit= (id:any)=>{
    this.setState({data: this.state.data.map((obj:any,i:number)=>{
     if(i===id){
       obj.editData = true;
     }else{
       obj.editData = false;
     }
     return {...obj}
     })});

     this.setState({file_number: this.state.data[id].file_number,
       location: this.state.data[id].location,
     })
 };

 onCancel =(id:any)=>{
    this.setState({data: this.state.data.map((obj:any,i:number)=>{
      if(i===id){
        obj.editData = false;
      }
      return {...obj}
    })
  })
    
  }

    render(){
        return(
            <>
            <div>
            <Toast ref={this.toast} />
            {this.state.loading ? <div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
                </div>:''}
              <div className="upper">
                      <p style={{padding:"1.25rem"}}><span style={{color:"#009DD0",fontSize:"1.5rem",fontWeight:"bold"}}>{this.state.last_name}</span> 
                      <br></br><span style={{color:"#009DD0",fontSize:"1.5rem",fontWeight:"bold"}}>{this.state.cus_no}</span></p>
              </div>
              
              <div className='content'>
            <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <p style={{color:"#fff",textAlign:"left",marginTop:"0.625rem"}}>System Number Informations</p>
                            </div>
                        </div>
                    </div>
                </div>
          <table className="table table-striped">
            <thead >
              <tr>
                <th style={{fontWeight:500}} scope="col">System Number</th>
                <th style={{fontWeight:500}} scope="col">System Name</th>
                <th style={{fontWeight:500,textAlign:"right"}} scope="col">Action</th>
              </tr>
            </thead>
            <tbody >
            {this.state.data.map((item: any,i: any)=>{
             return(
              <tr key={i}>
                <td>{item.file_number}</td>
                <td style={{padding:'0.5rem'}}>{item.editData ? <input style={{height:'2rem',width:'15.625rem',position:'absolute'}} type="text" className="form-control" name="location" value={this.state.location} onChange={(e)=>{this.setState({location : e.target.value})}}  /> : item.location}</td>
                <td style={{textAlign:"right"}}>{item.editData ? <span><img style={{cursor:"pointer",width:"0.75rem",height:"0.75rem",marginLeft:"-1.875rem",marginRight:"1.25rem"}} onClick={()=>this.onCancel(i)} alt="cross" src={cross} /><img style={{cursor:"pointer",width:"1rem",height:"1rem"}} onClick={(e)=>this.onUpdate(e,item.id)} alt="tick" src={tick} /></span>: <span> <img style={{cursor:"pointer",width:'1.3rem'}} onClick={()=>this.onEdit(i)} alt="edit" src={edit1} /></span>}</td>
               
              </tr>
              )})}
            </tbody>
          </table>
          </div> 
          </div>
            </>
        )
    }
}

export default SystemNumber;