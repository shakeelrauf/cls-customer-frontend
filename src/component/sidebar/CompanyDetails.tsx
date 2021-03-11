import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyDetails.css';
import { useEffect } from 'react';
import axiosInstance from '../../api/api'
import { useState } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import { Paginator } from 'primereact/paginator';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;

let CompanyDetails=()=> {
  //let history = useHistory();
  const initialFormData = Object.freeze({
    offset: 0,
    perPage: 10,
    totalRecords: 0,
    pageCount:0

});
  const [formData, setFormData]:any = useState(initialFormData);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState<any>(false);
  const [cus_no, setCus_no] = useState<any>('');
  const [last_name, setLast_name] = useState<any>('');

   useEffect(() =>{
    const fetchDataAsync = async () => {
        try {
            setLoading(true);
            const api = '/api/customer/company/details/';
            let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
            setData(response.data.data);
            let slice = response.data.data.slice(formData.offset, formData.offset + formData.perPage);
            setFormData({...formData, pageCount: Math.ceil(response.data.data.length / formData.perPage), totalRecords: response.data.data.length});
            setTableData(slice);
            setCus_no(response.data.cus_no);
            setLast_name(response.data.last_name);
            if(!(data===null)){
                setLoading(false);
              }
            return data;
        }catch(error){
            setLoading(false);
            throw error;
        }
     }   ;
     fetchDataAsync()
  },[]);
  

  const onPageChange = (event:any) => {
    let offset = event.first;
    let perPage = event.rows;
    setFormData({...formData , offset:offset, perPage:perPage})
    let slice = data.slice(offset, offset + perPage);
    setTableData(slice);
}
 
      return (
        <>
         <div>
               {loading ?<div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
                </div> : ''}
                <div className="upper">
                    <p style={{padding:"20px"}}><span className='heading'>{last_name}</span> 
                    <br></br><span className='heading'>{cus_no}</span></p>
                </div>
                <div className="content">
                <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Company Locations</p>
                            </div>
                        </div>
                    </div>
                </div >
                <table className="table table-striped">
                    <thead>
                        <tr >
                        <th style={{fontWeight:500}} scope="col">Location Name</th>
                        <th style={{fontWeight:500}} scope="col">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                       {tableData.map((item: any,i: any)=>{
                         return(
                        <tr>
                         <td>{item.location}</td>
                         <td>{item.address}</td>
                        </tr>
                         )})}
                         <tr>
                 <td colSpan={2}>
                  <Paginator first={formData.offset} rows={formData.perPage} totalRecords={formData.totalRecords} rowsPerPageOptions={[10,20,30]} 
                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                  onPageChange={onPageChange}></Paginator>
                  </td>
                  </tr>
                    </tbody>
                    
                </table>
                
                </div>
            </div>
        </>
      );
    }

export default CompanyDetails;  