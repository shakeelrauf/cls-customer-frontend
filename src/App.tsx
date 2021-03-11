import './App.css';
import Footer from './component/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import logolocks from './component/icons/logolocks1.png';
import heart from './component/icons/heart.svg';
import lock from './component/icons/lock.2a916e83.webp';
import door from './component/icons/door.a7527e00.webp';
import { Redirect, Route, useHistory } from "react-router";
import CreateAccount from './component/login/CreateAccount';
import Login from './component/login/Login';
import Home from './component/header/Home';
import Forget from './component/login/Forget';
import ChangePassword from './component/login/ChangePassword';
import ResetPassword from './component/login/ResetPassword';
import Header from './component/header/Header';
import NotFound from './component/NotFound';
import { useEffect } from 'react';

function App(props:any) {
  const history = useHistory();

  useEffect(()=>{
     console.log(window);
  },[])

  const icon = () =>{
    history.push('/home/companydetails');
  }
  const login = () =>{
    history.push('/');
  }

  return (
    <div className="App">
      <div className='row'>
        <div className='col-2' >
           <img style={{width:'12.7rem',float:'left',cursor:'pointer'}} alt="locks" src={logolocks}  onClick={localStorage.getItem("access_token")? icon : login} />
        </div>
        <div className='col-6'>
          <p style={{fontSize:'1.5rem',paddingTop:'1rem',marginBottom:'0px',paddingLeft:'1rem',fontStyle:'italic',textAlign:'right'}}>Thank you for supporting Small Business</p>
        </div>
        <div className='col-2' style={{textAlign:'left'}}>
          <img style={{width:'2.55rem',padding:'0.55rem 0px 0px 0px',margin:0}} alt="heart" src={heart} />
          <img style={{width:'2.5rem',padding:'0.55rem 0px 0px 0px',margin:0}} alt="door" src={door} />
          <img style={{width:'2.38rem',padding:'0.55rem 0px 0px 0px',margin:0}} alt="locks" src={lock} />
          
        </div>
        <div className='col-2'>
            <p style={{fontSize:'1.25rem',textAlign:'left',marginLeft:'-4.5rem',paddingTop:'1rem',marginBottom:0,fontStyle:'italic'}}>#YYC Local</p>
          </div>
      </div>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          {localStorage.getItem("access_token")?<Header />: history.push('/')}
          <Route path="/createaccount" component={CreateAccount} />
          <Route path='/forgot' component={Forget}/>
          <Route path='/changepassword' component={ChangePassword}/>
          <Route path='/resetpassword' component={ResetPassword}/>
        <Footer />
        <Route path='*' component={NotFound} />
    </div>
  );
}

export default App;
