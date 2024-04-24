import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { Api } from '../../utils/Api';
import Menu from '../../components/Menu';
import Title from '../../components/Title';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const LastTransactionPage = () => {
  const [loginUserBranchID, setLogInUserBranchID] = useState();
  const [loginUserID, setLogInUserID] = useState();
  const [loginUserName, setLogInUserName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transaction");
  const printElementRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user data and transactions on component mount
      let data = JSON.parse(sessionStorage.getItem('userKey'));
      setLogInUserBranchID(data.branch_id);
      setLogInUserID(data.user_id);
      setLogInUserName(data.user_name);
      
      let date = new Date();
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      let to_date = date.getDate() < 10 ? "0" + date.getDate() + 1 : date.getDate();
      let dateFormat = date.getFullYear() + "-" + month + "-" + to_date;

      const body = {
        branch_id: data.branch_id,
        user_id: data.user_id,
        date: dateFormat
      };
      
      const response = await Api.postRequest('/api/transaction/findTransaction', body);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleClick = (value) => {
    setActiveTab(value);
  };

  const handlePrintSummary = async () => {
    if (printElementRef.current) {
      const receiptData = printElementRef.current.innerText;
      // Save receipt data to a text file
      saveReceiptDataToFile(receiptData);
    }
  };

  const saveReceiptDataToFile = (receiptData) => {
    const blob = new Blob([receiptData], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'receipt.txt');
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
            <button className='btn btn_tab' type='button' onClick={() => handleClick("transaction")}>Transactions</button>
          </div>
          <div className='col-6 tab_right'>
            <button className='btn btn_tab' type='button' onClick={() => handleClick("summary")}>Summary</button>
          </div>
        </div>
        <div className={activeTab === "transaction" ? "deactive" : "tab_active"}>
          <div className='row'>
            <div className='col-12'>
              <div className='card card_info card-info-black-and-white' ref={printElementRef}>
                <div className='date'>{loginUserName}</div>
                <div className='date'>2024.01.23</div>
                <div className='price'>200000.00</div>
              </div>
            </div>
            <div className='col-12 pt-3 text-end'>
              <button className='btn btn-primary' onClick={handlePrintSummary}>Print Summary</button>
            </div>
          </div>
        </div>
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default LastTransactionPage;
