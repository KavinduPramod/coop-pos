import { React,useCallback, useState,useEffect } from 'react';
import './style.css';
import { Api } from '../../utils/Api'
import Menu from '../../components/Menu';
import Title from '../../components/Title';
import swal from 'sweetalert';

const HomePage = () => {

  const [txtEnterNIC, setEnterNIC] = useState();
  const [lblSetTitle, setSetTitle] = useState();
  const [lblSetID, setSetID] = useState("");
  const [lblSetName, setSetName] = useState("");
  const [lblSetNIC, setSetNIC] = useState("");
  const [lblSetCustomerNumber, setSetCustomerNumber] = useState("");
  const [lblRefNumber, setRefNumber] = useState();
  const [loginUserBranchID, setLogInUserBranchID] = useState();
  const [loginUserID, setLogInUserID] = useState();
  const [loginUserName, setLogInUserName] = useState();
  const [accountID, setSelectAccountID] = useState();

  const [lblAccountName, setAccountNumber] = useState("");
  const [lblOpenDate, setOpenDate] = useState("");
  const [lblBalance, setBalance] = useState("");
  const [lblInterest, setInterest] = useState("");
  const [lblPenFee, setPenFee] = useState("");
  const [lblInstallment, setInstallment] = useState("");
  const [lblPassDue, setPassdue] = useState("");
  const [lblPassdueDate, setPassdueDate] = useState("");
  const [lblPlAccountID, setPlAccountID] = useState();
  const [lblGlAccountID, setGlAccountID] = useState();
  const [txtEnterPrice, setEnterPrice] = useState();
  const [loanType, setLoanType] = useState();
  const [visibleFindAreaFindDetail, setVisibleFindAreaFindDetail] = useState(false);

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem('userKey'));
    setLogInUserBranchID(data.branch_id);
    console.log(data.branch_id);
    setLogInUserID(data.user_id);
    setLogInUserName(data.user_name);
  }, [loginUserBranchID]);

  const _handleSubmit = useCallback(async () => {
    const body = { id: txtEnterNIC, branch_id: loginUserBranchID,type:"nic"};
    const response =  await Api.postRequest('/api/customer/findNIC', body);
    console.log(response);
    if(response.code == 404){
      setVisibleFindAreaFindDetail(false)
    }else{
      setVisibleFindAreaFindDetail(true)
    }
    setSetTitle(response.title);
    setSetID(response.id);
    setSetName(response.name);
    setSetNIC(response.nic);
    setSetCustomerNumber(response.customer_number);
    setRefNumber(response.refNumbers);
  }, [txtEnterNIC,loginUserBranchID]);

  const _handleSave = useCallback(async () => {
    let date = new Date();
    let month = (date.getMonth()+1)<10 ? "0"+(date.getMonth()+1):(date.getMonth()+1);
    let to_date = date.getDate()<10 ? "0"+date.getDate()+1:date.getDate();
    let dateFormat = date.getFullYear()+"-"+month+"-"+to_date;

    let formatTime = date.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: false });
    
    const body = {
        id:0,
        transaction_number:lblAccountName,
        pl_account_id:lblPlAccountID,
        temp_transaction_type:1,
        entered_date:dateFormat,
        updated_date:dateFormat,
        entered_by:loginUserID,
        updated_by:loginUserID,
        debit:0,
        credit:parseFloat(txtEnterPrice),
        status:7,
        m_at:dateFormat+" "+formatTime,
        m_by:loginUserID,
        gl_account_id:lblGlAccountID,
        category_id:loanType,
        name:lblSetName,
        address:"4.2,Hikkaduwa,Galle",
        cheque_num:"",
        description:"R-"+lblGlAccountID,
        cash_bank_gl_account:0,
        update_type:2,
        ci_customer_id:lblSetID
    };
    const response =  await Api.postRequest('/api/receipt/saveReceiptDetails', body);
    if(response.code == 404){
      alert(response.message);
      swal("",response.message, "error");
      return;
    }else if(response.code == 200){
      swal("",response.message, "success");
      setInterval(function(){
        window.location.reload();
      },1000);
      return;
    }
    
  }, [lblPlAccountID,lblGlAccountID,lblSetID,txtEnterPrice,lblAccountName]);

  const selectAccountID = async (selectedValue) => {

    setSelectAccountID(selectedValue);
    const body = { accountNumber:selectedValue};
    const response =  await Api.getRequestBody('/api/receipt/findCustomerRefAccountNo', body);
    // console.log(response);
    setLoanType(response.loan_type);
    setAccountNumber(response.ref_account_number);
    setOpenDate(response.open_date);
    setBalance(response.balance);
    setInterest(response.interest);
    setPenFee(response.penalty+response.fee);
    setInstallment(response.capital_installment);
    setPassdue(response.past_due_amount);
    setPassdueDate(response.past_due_days);
    setPlAccountID(response.pl_account_id);
    setGlAccountID(response.gl_account_id);
  };

  return (
    <div className='viewContainer'>
      <Title />
      <div className='mainLayout'>
        <div className='row'>
          <div className='col-12 text-center mt-2 mb-2'>
            <label className='mainTitle'>Cash Receipt</label>
          </div>
          <div className='col-12'>
            <div className='row'>
              <div className='col-9 findArea'>
                <input 
                  class="form-control border-1 rounded-0" 
                  type="text" 
                  id="txtEnterNIC" 
                  placeholder="Enter Customer No or NIC" 
                  value={txtEnterNIC}
                  name="txtEnterNIC"
                  onChange={e => setEnterNIC(e.target.value)}
                />
              </div>
              <div className='col-3 findArea'>
                <button className='btn btn-primary' id="btnSava" onClick={_handleSubmit} type='button'>Find</button>
              </div>
            </div>
          </div>
        </div>
        <div className={(visibleFindAreaFindDetail)?"areaFindDetailView":"areaFindDetailViewHide"}>
          <div className='row mb-2'>
            <div className='col-12'>
            <div className='mt-2 mb-3'>
              <div className='card_customer_detail'>
                <div>{lblSetName==""?"":lblSetName}</div>
                <div>{lblSetNIC==""?"":lblSetNIC}</div>
                <div>{lblSetCustomerNumber==""?"":lblSetCustomerNumber}</div>
              </div>
            </div>
            </div>
            <div className='col-5 text-end'>
              <label>Account No :</label>
            </div>
            <div className='col-7'>
            <select className='form-select'  onChange={(e) => selectAccountID(e.target.value)}>
              {Array.isArray(lblRefNumber) && lblRefNumber.map((ref, index) => (
                <option key={index} value={ref.ref_account_number}>{ref.ref_account_number}</option>
              ))}
            </select>
            </div>
          </div>
        </div>
        <div id='areaDetailsView'>
          
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Account Name : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblAccountName==""?"-":lblAccountName}/>
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Open Date : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblOpenDate==""?"-":lblOpenDate}/>
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Balance : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblBalance==""?0:lblBalance} />
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Interest : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblInterest==""?0:lblInterest}/>
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Pen. + Fee : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblPassDue==""?"-":lblPassDue}/>
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Installment : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblInstallment==""?0:lblInstallment} />
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Passdue : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblPassDue==""?0:lblPassDue} />
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-5 text-end'>
              <label>Passdue Date : </label>
            </div>
            <div className='col-7'>
              <input class="form-control" type="text" id="txtEnterNIC" disabled value={lblPassdueDate==""?"-":lblPassdueDate}/>
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-12 mb-2'>
              <input class="form-control" type="text" id="txtEnterNIC" placeholder='Enter Deposit Amount'
                value={txtEnterPrice}
                onChange={e => setEnterPrice(e.target.value)} />
            </div>
            <div className='col-12'>
              <button className='btn btn-primary' id="btnSava" onClick={_handleSave} type='button'>Save</button>
            </div>
          </div>
        </div>
      </div>
      <Menu value={"Receipt"} />
    </div>
  );
};

export default HomePage;