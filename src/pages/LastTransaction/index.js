import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { Api } from "../../utils/Api";
import Menu from "../../components/Menu";
import Title from "../../components/Title";
import html2canvas from "html2canvas"; // Import html2canvas library

const LastTransactionPage = () => {
  const [loginUserBranchID, setLogInUserBranchID] = useState();
  const [loginUserID, setLogInUserID] = useState();
  const [loginUserName, setLogInUserName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transaction");
  const [currentDate, setCurrentDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0); // State to keep track of offset

  const printElementRef = useRef(null);

  const fetchData = async (fetchOffset) => {
    // Use fetchOffset instead of offset
    // This ensures that the initial offset is set correctly
    
    let data = JSON.parse(sessionStorage.getItem("userKey"));
    setLogInUserBranchID(data.branch_id);
    setLogInUserID(data.user_id);
    setLogInUserName(data.user_name);
  
    let date = new Date();
    let month =
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let to_date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let dateFormat = date.getFullYear() + "-" + month + "-" + to_date;
  
    setCurrentDate(dateFormat);
  
    const datax = await Api.postRequest("/api/transaction/findTransaction", {
      branch_id: data.branch_id,
      user_id: data.user_id,
      date: dateFormat,
      offset: fetchOffset, // Use fetchOffset instead of offset
    });
  
    if (Array.isArray(datax)) {
      if (fetchOffset === 0) {
        // If fetching initial data, set transactions directly
        setTransactions(datax);
      } else {
        // If fetching more data, append to existing transactions
        setTransactions((prevTransactions) => [...prevTransactions, ...datax]);
      }
      // Increment the offset only when fetching more data
      setOffset((prevOffset) => prevOffset + 10);
    } else {
      alert("Error fetching transactions");
    }
  
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Fetch initial data with an offset of 0
    fetchData(0);
  }, []);
  
  const handleClick = (value) => {
    setActiveTab(value);
  };

  const handlePrintSummary = async () => {
    html2canvas(printElementRef.current, { backgroundColor: "#ffffff" }).then(
      (canvas) => {
        const username = loginUserName;
        const date = "2024.01.23";
        const price = "200000.00";
        window.lee.funAndroid(username, date, price);
      }
    );
  };

  const handleLoadMore = () => {
    fetchData(); // Fetch more transactions
  };


  return (
    <div className="viewContainer">
      <Title />
      <div className="mainLayout">
        <div className="row">
          <div className="col-12 text-center mt-2 mb-2">
            <label className="mainTitle">Last Transactions</label>
            <div className="col-12 text-center mt-2 mb-2">
              <label className="mainTitle"> Date : {currentDate} </label>
            </div>
          </div>
          <div className="col-6 tab_left">
            <button
              className="btn btn_tab"
              type="button"
              onClick={() => handleClick("transaction")}
            >
              Transactions
            </button>
          </div>
          <div className="col-6 tab_right">
            <button
              className="btn btn_tab"
              type="button"
              onClick={() => handleClick("summary")}
            >
              Summary
            </button>
          </div>
        </div>
        <div
          className={activeTab === "transaction" ? "deactive" : "tab_active"}
        >
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <div className="card card_info" ref={printElementRef}>
                <div className="date">{loginUserName}</div>
                <div className="date">2024.01.23</div>
                <div className="price">200000.00</div>
              </div>
            </div>
            <div className="col-3"></div>
            <div className="col-12 pt-3 text-end">
              <button className="btn btn-primary" onClick={handlePrintSummary}>
                Print Summary
              </button>
            </div>
          </div>
        </div>
        <div className={activeTab === "summary" ? "deactive" : "tab_active"}>
          <div className="row">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Member Name</th>
                    <th>Gl_Account__id</th>
                    <th>Customer id</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.transaction_number}</td>
                      <td>{transaction.credit}</td>
                      <td>{transaction.name}</td>
                      <td>{transaction.gl_account_id}</td>
                      <td>{transaction.ci_customer_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 pt-3 text-end">
          <button className="btn btn-primary" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default LastTransactionPage;
