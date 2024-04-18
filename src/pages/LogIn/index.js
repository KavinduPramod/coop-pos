import React, { useCallback, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom'
import { Api } from '../../utils/Api'
import swal from 'sweetalert';


const LoginPage = () => {

  const { replace, push } = useNavigate();
  const [txtUserName, setUserName] = useState('');
  const [txtPassword, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  const _handleSubmit = useCallback(async () => {
    console.log(txtUserName);
    console.log(txtPassword);
    setLoading(true);

    const body = { name: txtUserName, password: txtPassword};
    const response =  await Api.postRequest('/api/user/login', body);
    // let responseData = response;
    if(response.code == 404){
      swal("",response.message, "warning");
      return;
    }else if(response.code == 400){
      swal("",response.message, "warning");
      return;
    }else if(response.code == 500){
      swal("",response.message, "error");
      return;
    }else if(response.code == 200){
      sessionStorage.getItem("userKey");
      sessionStorage.setItem("userKey", JSON.stringify(response));
      setResponseData(response);
      navigate('/home');
    }else if(response.code == 201){
      swal("",response.message, "info");
      return;
    }
  }, [txtUserName, txtPassword, replace]);

  return (
    <div className="main_wrapper">
      <div className="wrapper">
        <div className="text-center mt-4 name">
          POS System
        </div>
        <form className="p-3 mt-3">
          <div>
            <label className='lblText '>User Name</label>
            <input
              className="form-control no-border"
              type="text"
              name="txtUserName"
              id="txtUserName"
              value={txtUserName}
              onChange={e => setUserName(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label className='lblText'>Password</label>
            <input
              className="form-control no-border"
              type="password"
              name="txtPassword"
              id="txtPassword"
              value={txtPassword}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button className="btn mt-3" onClick={_handleSubmit} type='button'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;