import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
/* import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import Home from './Home';
import Services from './Services';
import Product from './Product';
import Industries from './Industries';
import News from './News';
import About from './About';
import ContactUs from './ContactUs'; */
import './Header.css';


class Header extends React.Component {
    render() {
      return (
          <>
          <div >
             {/*  <nav className="navbar navbar-expand-lg navbar-light bg-light">
                  <ul className="navbar-nav mr-auto">
                      <li><Link to="/home" className="nav-link"> HOME</Link></li>
                      <li><Link to="/product" className="nav-link">PRODUCT</Link></li>
                      <li><Link to="/services" className="nav-link">SERVICES</Link></li>
                      <li><Link to="/industries" className="nav-link">INDUSTRIES & PARTNERS</Link></li>
                      <li><Link to="/news" className="nav-link">NEWS</Link></li>
                      <li><Link to="/about" className="nav-link">ABOUT</Link></li>
                      <li><Link to="/contactus" className="nav-link">CONTACT US</Link></li>
                  </ul>
              </nav>
              <main>
                  <Switch>
                      <Route path='/product' component={Product}/>
                      <Route path='/services' component={Services}/>
                      <Route path='/industries' component={Industries}/>
                      <Route path='/news' component={News}/>
                      <Route path='/about' component={About}/>
                      <Route path='/contactus' component={ContactUs}/>
                  </Switch>
              </main> */}
          </div>
          </>
      )
    }
  }

export default Header;  