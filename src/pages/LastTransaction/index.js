import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { Api } from '../../utils/Api';
import Menu from '../../components/Menu';
import Title from '../../components/Title';
import html2canvas from 'html2canvas'; // Import html2canvas library

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

// Inside your component
const [transactions, setTransactions] = useState([
  { id: 1, date: '2024-05-01', amount: 1000, branchId: 123, customerName: 'John Doe', customerNumber: '1234567890' },
  { id: 2, date: '2024-05-02', amount: 1500, branchId: 456, customerName: 'Jane Smith', customerNumber: '0987654321' },
  { id: 3, date: '2024-05-03', amount: 2000, branchId: 789, customerName: 'Alice Johnson', customerNumber: '5678901234' },
  // Add more dummy data as needed
]);

  const handlePrintSummary = async () => {
    // Capture the element and convert it into a bitmap image
    html2canvas(printElementRef.current, { backgroundColor: "#ffffff" }).then(canvas => {  // Get the login username, date, and price
      const username = loginUserName;
      const date = '2024.01.23';
      const price = '200000.00'; 
    
      // Call the Android function passing the Base64 string
      window.lee.funAndroid(username, date, price);
    });
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
            <div className='col-3'></div>
            <div className='col-6'>
              <div className='card card_info' ref={printElementRef}>
                <div className='date'>{loginUserName}</div>
                <div className='date'>2024.01.23</div>
                <div className='price'>200000.00</div>
              </div>
            </div>
            <div className='col-3'></div>
            <div className='col-12 pt-3 text-end'>
              <button className='btn btn-primary' onClick={handlePrintSummary}>Print Summary</button>
            </div>
          </div>
        </div>
        <div className={activeTab === "summary" ? "deactive" : "tab_active"}>
          <div className='row'>
              <div className='table-container'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Branch Id</th>
                    <th>Customer Name</th>
                    <th>Customer Number</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.date}</td>
                      <td>{transaction.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default LastTransactionPage;
