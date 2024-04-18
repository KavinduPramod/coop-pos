import { React, useState, useEffect, useRef } from 'react';
import './style.css';
import { Api } from '../../utils/Api';
import Menu from '../../components/Menu';
import Title from '../../components/Title';
import html2canvas from 'html2canvas';

const LastTransactionPage = () => {
  const [loginUserBranchID, setLogInUserBranchID] = useState();
  const [loginUserID, setLogInUserID] = useState();
  const [loginUserName, setLogInUserName] = useState();
  const [transactionData, setTransactionData] = useState([]);
  const [transactionDataSize, setTransactionDataSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transaction");
  const printElementRef = useRef(null);

  useEffect(() => {
    // Fetch user data and transactions on component mount
    const fetchData = async () => {
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
      if (response.code === 404) {
        setTransactionDataSize(0);
      } else {
        setTransactionData(response);
      }
      
      setIsLoading(false);
    };

    fetchData();

    // Define the 'lee' object and its method 'funAndroid' globally
    window.lee = {
      funAndroid: function(base64Data) {
        // This method will be called when invoked from JavaScript
        console.log("Received data from JavaScript:", base64Data);
        // Additional logic for handling the received data
      }
    };
  }, []);

  const handleClick = (value) => {
    setActiveTab(value);
  };

  const handlePrintSummary = () => {
    if (printElementRef.current) {
      html2canvas(printElementRef.current).then(canvas => {
        const image = canvas.toDataURL("image/png");
        console.log("Image captured:", image);
        window.lee.funAndroid(image);
        // Here you can perform further actions with the captured image
        // For example, you can send it to the server, download it, etc.
      });
    }
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
        {/* Add your other tab content here */}
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default LastTransactionPage;
