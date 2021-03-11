import React from 'react';

class CompanyDetailsSummary extends React.Component {
    render(){
        return(
            <>
            <div className="container">
        <div className="accordian"> 
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                    <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Company Details</p>
                </div>
              </div>
            </div>
          </div><br/>
          <div className="col-12">
            <div className="row">
                <div className="col-2">
                   <label><strong>Company Name</strong></label>
                   <p>Fedex</p>
                </div>
                <div className="col-2">
                   <label><strong>Phone Number</strong></label>
                   <p>306-686-7832</p>
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
            </>
        )
    }
}

export default CompanyDetailsSummary;