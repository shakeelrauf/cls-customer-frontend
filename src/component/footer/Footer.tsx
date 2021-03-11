import React from 'react';
import './Footer.css'

class Footer extends React.Component {
    render() {
      return (
        <div className="footer">
             <p style={{display:"inline-block",textAlign:"center",fontSize:"0.875rem",padding:"0.813rem"}}>© 2021 Calgary Lock & Safe. All Rights Reserved. Some logos are copyright of their respective holders. Some images and video courtesy of Freepik.com and pexels.com</p>
        </div>
      );
    }
  }

export default Footer;  