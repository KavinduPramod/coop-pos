import { React,useCallback, useState,useEffect, lazy } from 'react';
import './style.css';
import { Api } from '../../utils/Api'
import Menu from '../../components/Menu';
import Title from '../../components/Title';
import swal from 'sweetalert';

const LastTransactionPage = () => {
  
  const [loginUserBranchID, setLogInUserBranchID] = useState();
  const [loginUserID, setLogInUserID] = useState();
  const [loginUserName, setLogInUserName] = useState();
  const [transactionData, setTransactionData] = useState([]);
  const [transactionDataSize, setTransactionDataSize] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("tranaction");
  

  useEffect( () => {
  
    let data = JSON.parse(sessionStorage.getItem('userKey'));
    setLogInUserBranchID(data.branch_id);
    setLogInUserID(data.user_id);
    setLogInUserName(data.user_name);
    const fetchTransactions = async () => {
      let date = new Date();
        let month = (date.getMonth()+1)<10 ? "0"+(date.getMonth()+1):(date.getMonth()+1);
        let to_date = date.getDate()<10 ? "0"+date.getDate()+1:date.getDate();
        let dateFormat = date.getFullYear()+"-"+month+"-"+to_date;
    
        const body = {
          branch_id:data.branch_id,
          user_id:data.user_id,
          date:dateFormat
        };
        const response =  await Api.postRequest('/api/transaction/findTransaction', body);
        (response.code == 404)?setTransactionDataSize(0):setTransactionData(response);
        
        setIsLoading(false);
    };
    fetchTransactions();
  }, []);

  const handleClick = (value) => {
    console.log("Button clicked with value:", value);
    setActiveTab(value);
  };

  return (
    <div className='viewContainer'>
      <Title />
      <div className='mainLayout'>
        <div className='row'>
          <div className='col-12 text-center mt-2 mb-2'>
            <label className='mainTitle'>Last Transactions</label>
          </div>
          <div className='col-6 tab_left'>
            <button className='btn btn_tab' type='button' onClick={() => handleClick("tranaction")}>Transactions</button>
          </div>
          <div className='col-6 tab_right'>
            <button className='btn btn_tab' type='button' onClick={() => handleClick("summary")}>Summary</button>
          </div>
        </div>
        <div className={activeTab === "tranaction" ? "deactive" : "tab_active"}>
          <div className='row'>
            <div className='col-12'>
              <div className='card card_info'>
                <div className='date'>Akila Kumara</div>
                <div className='date'>2024.01.23</div>
                <div className='price'>200000.00</div>
              </div>
            </div>
            <div className='col-12 pt-3 text-end'>
              <button className='btn btn-primary'>Print Summary</button>
            </div>
          </div>
        </div>
        <div className={activeTab !== "summary" ? "tab_active" : "deactive"}>
          <div className='row'>
            <div className='col-12'>
              {isLoading ? 
                <div className='row'>
                  <div className='col-12'>
                    <div className='card card_not_found'>No Transactions Today</div>
                  </div>
                </div> 
                : 
                <div>
                  {transactionData.map((x) => { 
                    return (
                      <div className='card'>
                  
                        <div className='card_row'>
                        <label>{x.description}</label>
                        <label>{x.m_at}</label>
                        </div>
                        <label className='pt-1'>{x.customer_number} | {x.ref_number}</label>
                        <div className='card_row_last'>
                        <label>{x.credit}</label>
                        </div>
                      </div>
                      )
                  })}
                </div>
              }
              
              
              {/* <div className='card'>
                
                <div className='card_row'>
                <label>R0001</label>
                <label>2024-03-25</label>
                </div>
                <label className='pt-1'>CR0001 | AC0001</label>
                <div className='card_row_last'>
                <label>2500000.00</label>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default LastTransactionPage;