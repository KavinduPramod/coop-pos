const { getConnection } = require("../config/db");

const findCustomerRefAccountNo = async (req, res) => {
  try {
    let accountNumber = req.body.accountNumber;
    const connection = await getConnection();
    const query = `SELECT ci_customer.nic, 
                        ci_customer.id as custID, 
                        ci_customer.customer_number, 
                        pl_account.ref_account_number, 
                        pl_account_type.name_ln1, 
                        pl_account.open_date, 
                        pl_account.balance, 
                        pl_account.interest, 
                        pl_account.penalty, 
                        pl_account.fee, 
                        pl_account.capital_installment, 
                        pl_account.past_due_amount, 
                        pl_account.past_due_days, 
                        pl_account.id as plAccId, 
                        pl_account.gl_account_id, 
                        ci_customer.full_name_ln1, 
                        ci_customer.address_ln1, 
                        ci_customer.ini_name_ln1, 
                        ci_customer.mobile_1, 
                        ci_customer.home_phone, 
                        pl_account_type.pl_account_category_id as loan_type
                    FROM ci_customer 
                    INNER JOIN pl_account ON ci_customer.id = pl_account.ci_customer_id
                    INNER JOIN pl_account_type ON pl_account.pl_account_type_id = pl_account_type.id 
                    AND pl_account.pl_account_type_id = pl_account_type.id
                    WHERE pl_account.ref_account_number = ?`;
    const result = await connection.query(query, [accountNumber]);

    if (result.length == 0) {
      return 0;
    }

    const resultValue = result[0];
    let sessionData = {
      nic: resultValue.nic,
      customer_id: resultValue.custID,
      customer_full_name: resultValue.full_name_ln1,
      customer_ini_name: resultValue.ini_name_ln1,
      customer_address: resultValue.address_ln1,
      customer_mobile: resultValue.mobile_1,
      customer_home_phone: resultValue.home_phone,
      customer_number: resultValue.customer_number,
      ref_account_number: resultValue.ref_account_number,
      name_ln1: resultValue.name_ln1,
      open_date: resultValue.open_date,
      balance: resultValue.balance,
      interest: resultValue.interest,
      penalty: resultValue.penalty,
      fee: resultValue.fee,
      capital_installment: resultValue.capital_installment,
      past_due_amount: resultValue.past_due_amount,
      past_due_days: resultValue.past_due_days,
      pl_account_id: resultValue.plAccId,
      gl_account_id: resultValue.gl_account_id,
      loan_type: resultValue.loan_type,
    };
    return sessionData;
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Internal Server Error");
  }
};

const saveReceiptDetails = async (req, res) => {
  try {
    let id = req.body.id;
    let transaction_number = req.body.transaction_number;
    let pl_account_id = req.body.pl_account_id;
    let temp_transaction_type = req.body.temp_transaction_type;
    let entered_date = req.body.entered_date;
    let updated_date = req.body.updated_date;
    let entered_by = req.body.entered_by;
    let updated_by = req.body.updated_by;
    let debit = req.body.debit;
    let credit = req.body.credit;
    let status = req.body.status;
    let m_at = req.body.m_at;
    let m_by = req.body.m_by;
    let gl_account_id = req.body.gl_account_id;
    let category_id = req.body.category_id;
    let name = req.body.name;
    let address = req.body.address;
    let cheque_num = req.body.cheque_num;
    let description = req.body.description;
    let cash_bank_gl_account = req.body.cash_bank_gl_account;
    let update_type = req.body.update_type;
    let ci_customer_id = req.body.ci_customer_id;

    let branch_id = req.body.branch_id;

    // Get the current date
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const transactionYear = currentDate.getFullYear().toString();
    const formattedYear = transactionYear.slice(-2);
    const formattedYearWithV = "M" + formattedYear;

    const connection = await getConnection();
    const logedUser = req.m_by;

    const transactionNumberQuery = `
            SELECT last_number
            FROM it_transaction_numbers
            WHERE branch_id = ? AND it_transaction_type_id = ?;
          `;

    const transactionNumberResult = await connection.query(
      transactionNumberQuery,
      [branch_id, 7]
    );
    let fiscalYearId;

    const fiscalYearQuery = `
            SELECT id
            FROM it_fiscal_year
            WHERE year_name = ?;
          `;

    const fiscalYearResult = await connection.query(fiscalYearQuery, [
      transactionYear,
    ]);

    if (fiscalYearResult.length > 0) {
      fiscalYearId = fiscalYearResult[0].id;
    } else {
      console.log("Fiscal year not found.");
    }

    let transactionNumber;

    if (transactionNumberResult.length > 0) {
      transactionNumber = transactionNumberResult[0].last_number + 1;
    } else {
      console.log("Branch ID not found in it_transaction_numbers table.");
    }

    // Pad the transactionNumber with leading zeros
    const paddedTransactionNumber = transactionNumber
      .toString()
      .padStart(7, "0");

    const updated_transaction_number =
      branch_id + "-" + formattedYearWithV + paddedTransactionNumber;

    if (transactionNumberResult.length > 0) {
      transactionNumber = transactionNumberResult[0].last_number + 1;
    } else {
      console.log("Branch ID not found in it_transaction_numbers table.");
    }

    console.log("Updated Transaction Number:", updated_transaction_number);

    const query = `INSERT INTO temp_transaction
                  (id,transaction_number,gl_account_id,category_id,pl_account_id,name,address,cheque_num,description,cash_bank_gl_account,
                  update_type,temp_transaction_type,entered_date,updated_date,entered_by,updated_by,debit,credit,status,m_at,
                  m_by,ci_customer_id)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await connection.query(query, [
        id,updated_transaction_number, gl_account_id, category_id, pl_account_id, name, address,
        cheque_num, description, cash_bank_gl_account, update_type, temp_transaction_type,
        entered_date, updated_date, entered_by, updated_by, debit, credit,
        status, m_at, m_by,ci_customer_id
    ]);
    if(result.affectedRows==0){
        return 0;
    }
    // Update the last_number in it_transaction_numbers table
    const updateTransactionNumberQuery = `
            UPDATE it_transaction_numbers
            SET last_number = ?,
                c_at = ?,
                c_by = ?,
                m_at = ?,
                m_by = ?
            WHERE branch_id = ? AND it_transaction_type_id = ?;
        `;

    const updateTransactionNumberResult = await connection.query(
      updateTransactionNumberQuery,
      [
        transactionNumber,
        formattedCurrentDate,
        logedUser,
        formattedCurrentDate,
        logedUser,
        branch_id,
        7,
      ]
    );

    if (updateTransactionNumberResult.affectedRows === 0) {
      await connection.rollback();
      return 0;
    }

    await connection.commit();
    return 1;
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  findCustomerRefAccountNo,
  saveReceiptDetails,
};
