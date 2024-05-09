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
  const [summary, setSummary] = useState(null); // State to hold the summary

  const printElementRef = useRef(null);

// Add a state to track the total number of transactions for the day
const [totalTransactions, setTotalTransactions] = useState(0);

const fetchData = async () => {
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
  });

  if (Array.isArray(datax)) {
    setTotalTransactions(datax.length); // Set the total number of transactions
    setTransactions(datax.slice(0, 10)); // Set initial transactions to display
    setOffset(10); // Set initial offset to 10
  } else {
    alert("Error fetching transactions");
  }

  setIsLoading(false);
};

const handleLoadMore = () => {
  if (transactions.length === totalTransactions) {
    alert("All transactions within the day have been loaded");
  } else {
    fetchData(); // Fetch more transactions
  }
};


  useEffect(() => {
    // Fetch initial data with an offset of 0
    fetchData(0);
  }, []);

  const handleClick = (value) => {
    setActiveTab(value);
    if (value === "summary") {
      generateSummary(); // Generate summary when clicking on "Summary" tab
    }
  };

  const generateSummary = () => {
    // Calculate summary based on the loaded transactions
    const totalAmount = transactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.credit),
      0
    );
    setSummary(totalAmount.toFixed(2));
  };

  const handlePrintSummary = async () => {
    html2canvas(printElementRef.current, { backgroundColor: "#ffffff" }).then(
      (canvas) => {
        const username = loginUserName;
        const date = currentDate;
        const price = summary;
        window.lee.funAndroid(username, date, price);
      }
    );
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
                <div className="date">{currentDate}</div>
                <div className="price">{summary}</div>
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
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer_number</th>
                    <th>Amount</th>
                    <th>Name</th>
                    <th>Gl_Account__id</th>
                    <th>Customer id</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                      <td>{transaction.transaction_number}</td>
                      <td>{transaction.customer_number}</td>
                      <td>{transaction.credit.toFixed(2)}</td>
                      <td>{transaction.name_ln1}</td>
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
          {activeTab === "transaction" && ( 
            <button className="btn btn-primary" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </div>
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default LastTransactionPage;
