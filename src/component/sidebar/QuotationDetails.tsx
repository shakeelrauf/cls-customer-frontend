import React from 'react';
import viewa from '../icons/viewa.svg';
import axiosInstance from '../../api/api';
import Modal from 'react-modal';
import logopay from '../icons/logopay.png';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import Payment from './Payement/Payment';
import cancel from '../icons/cancel.svg';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:35%;
  margin-left: 40rem;
`;
interface Props {
  invoiceData:any;
  modalIsOpen:any;
  loading : boolean;
  invoicePop : any;
  invoiceTable : any;
  card:any;
  quoteNumber:any;
  quoteAmount:any;
}

class QuotationDetails extends React.Component<{locationNo:any,load:any,loadt:any},Props> {
  constructor(props:any){
    super(props);
    this.state ={
      invoiceData:[],
      modalIsOpen : false,
      loading : false,
      invoicePop : [], 
      invoiceTable : [],
      card:false,
      quoteNumber:'',
      quoteAmount:'',

    }
  }
  customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-20%',
      transform             : 'translate(-50%, -50%)',
      width                 : '46.875rem',
      height                : '37.5rem'
    }
  };

  fetchedData = async() => {
   // this.setState({loading : true});
   try {
    
     const api = `/api/customer/quotations/list/${this.props.locationNo}/pending/`;
     let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
     this.setState({invoiceData:response.data});
     if(!(this.state.invoiceData === null))
     {
         this.setState({loading : false});
         this.props.load();
     }
 }catch(error){
     this.setState({loading : false});
     throw error;
 }
  }

  invoice = async(quote_no:any) => {
    //this.setState({loading : true});
    this.props.loadt();
    try {
    
      const api = `/api/customer/quotations/detail/${this.props.locationNo}/${quote_no}/`;
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
      this.setState({invoicePop:response.data,quoteNumber: response.data.quote, quoteAmount:response.data.invoice_total});
      this.setState({invoiceTable : response.data.sales_data});
      if(!(this.state.invoiceData === null))
      {
          this.setState({loading : false});
          this.props.load();
          
      }
  }catch(error){
      this.setState({loading : false});
      this.props.load();
      throw error;
  }
    this.setState({card:false}); 
    this.setState({modalIsOpen:true});
  }

  pay = () =>{
    this.setState({card:true});
  }

  cancelPay = () =>{
    this.setState({card:false});
  }

  renderModal = () =>{ 
    if(this.state.card){
      return (
        <>
        <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
          </div>
        <Payment quote={this.state.quoteNumber} amount={this.state.quoteAmount} />
        <div style={{textAlign:'center'}}>
        <button 
          className="btn btn-outline-danger"
          type="button"><span className="MuiButton-label" onClick={this.cancelPay} >Cancel</span><span
              className="MuiTouchRipple-root"></span></button>
          </div>         
                  
        </>
      )
  }else{
    const quote_date  = this.state.invoicePop.quote_date? new Date(this.state.invoicePop.quote_date).toLocaleDateString(): '';
    return(
        <div>
          <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
               </div>
          <div className='row'>
            <div className='col-6'>
              <p style={{textAlign:"left"}} >
              <span style={{fontSize:"1.25rem",fontWeight:500,color:"#5C5C5C"}}>Billed To:</span><br></br>
              <span style={{fontSize:"1.25rem",fontWeight:500}}>{this.state.invoicePop.name}</span><br></br>
              <p style={{fontSize:"1.063rem",fontWeight:500,color:"#5C5C5C",width:"12.625rem",height:"3.375rem"}}>{this.state.invoicePop.address}</p>
              <span style={{fontSize:"1.25rem",fontWeight:500}}>Customer# : {this.state.invoicePop.cus_no}</span><br></br>
              </p>
            </div>
            <div className='col-6'>
              <p style={{textAlign:"right"}}>
              <span style={{fontSize:"1.875rem",fontWeight:500}}>Quote</span><br></br>
             <span style={{fontSize:"1.25rem",fontWeight:500}}> #{this.state.invoicePop.quote}</span><br></br>
              <span style={{fontSize:"1rem",fontWeight:500}}>{quote_date}</span>
              </p>
            </div>
          </div>
          <table className="table" style={{backgroundColor:"#fff"}}>
            <thead style={{ color: "#fff",backgroundColor:"#0D93C9" }}>
              <tr>
                <th data-visible="true" >Description</th>
                <th>QTY</th>
                <th>Invoice</th>
                <th>Each</th>
                <th style={{textAlign:"right"}}>Amount</th>
              </tr>
            </thead>
             <tbody>
            {this.state.invoiceTable.map((item: any,i: any)=>{
                return(
              <tr >
                <td >{item.desc}</td>
                <td>{item.quantity}</td>
                <td>{item.invoice}</td>
                <td>{item.price}</td>
                <td style={{textAlign:"right"}}>{item.amount}</td>
              </tr>
                  )})}
            </tbody> 
            <tr>
              <td colSpan={5}>
                <div className='row'>
                  <div className='col-6'>
                    <p style={{cursor:"pointer",color:"#009ED6"}}>Term and Conditions</p>
                  </div>
                  <div className='col-6'>
                    <p style={{textAlign:"right"}}>Sub Total : ${this.state.invoicePop.amount}<br></br>
                    GST(2235785) : ${this.state.invoicePop.tax}<br></br>
                    Total : ${this.state.invoicePop.invoice_total}<br></br>
                     <span style={{fontWeight:500}}>Amount owning : ${this.state.invoicePop.invoice_total}</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            </table>
            <div className='row'>
              <div className='col-6'>
                <img alt="viewkeys" src={logopay} style={{width:'10rem'}}/><br></br>
                 <span>www.calgarylockandsafe.com</span>
              </div>
              {/* <div className='col-6'>
              <button style={{width:"139px",height:"45px",backgroundColor:"#009ED6",float:'right'}} className="btn btn-primary" type="submit" onClick={this.pay}>Pay Invoice</button>
              </div> */}
            </div>
        </div>
    )
                }
  }

  closeModal = () =>{
    this.setState({modalIsOpen:false});
    this.setState({card:false});
  }

 componentDidMount= async()=>{
   this.fetchedData();
 }

    render() {
      return (
          <>
          <div>
          {
              this.state.loading ? <div className='overlay-box2'>
              <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
          </div> :''
            }
          <div>
          <Modal style={this.customStyles} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>{this.renderModal()}</Modal>
          <table className="table table-striped" style={{border :'2px solid #12739A'}}>
            <thead>
              <tr>
                <th style={{fontWeight:500}} scope="col">S.No.</th>
                <th style={{fontWeight:500}} scope="col">Quote Number</th>
                <th style={{fontWeight:500}} scope="col">Quote Date</th>
                <th style={{fontWeight:500}} scope="col">Sales Person</th>
                <th style={{fontWeight:500}} scope="col">Amount</th>
                <th style={{fontWeight:500,textAlign:"right"}} scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
            {this.state.invoiceData.map((item: any,i: any)=>{
              let date = new Date(item.quote_date).toLocaleDateString("fr-CA")
                return(
              <tr key={i} >
                <td scope="row">{i+1}</td>
                <td>{item.quote}</td>
                <td>{date}</td>
                <td>{item.sales_person}</td>
                <td>{item.amount}</td>
                <td style={{textAlign:"right"}}>
                    <img data-toggle="tooltip" data-placement="top" title="View Quote" alt="eye" style={{marginLeft:"1rem",cursor:"pointer",width:'1.8rem'}} onClick={()=>this.invoice(item.quote)} src={viewa}/>
                </td>
              </tr>
              )})}
            </tbody>
          </table>
          </div>
          </div>
          </>
      );
    }
  }

export default QuotationDetails;  