import React from 'react';
import save from '../icons/floppy-disk.svg'

class EditUserInformation extends React.Component {
    render() {
      return (
          <>
          <div>
          <div className="accordian"> 
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                    <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Edit Details</p>
                </div>
                <div className="col-6">
                  <span className="detail-created"><img style={{marginRight:"8px",marginLeft:'10px'}} alt="save" src={save} />Save</span>
                  <span className="detail-created">Cancel</span>
                </div>
              </div>
            </div>
          </div><br/>
                <form>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder="Tim Hortons"/>
                                </div>
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder="306-686-7832"/>
                                </div>
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder="user@gmail.com"/>
                                </div>
                            </div>
                        </div><br></br>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder="1941 Terry fox Dr"/>
                                </div>
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder="Fond Du Lac"/>
                                </div>
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder="Saskatchewan"/>
                                </div>
                            </div>
                        </div><br></br>
                        <div className="col-4">
                                <input type="text" className="form-control" placeholder="S4P 3Y2"/>
                         </div>
                    
                </form>
          </div>
          </>
      );
    }
  }

export default EditUserInformation;  