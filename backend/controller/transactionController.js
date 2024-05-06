const { getConnection } = require('../config/db');

const findTransaction = async (req, res) => {
    try {
        let user_id= req.body.user_id;
        let branch_id= req.body.branch_id;
        let date= req.body.date;
        const connection = await getConnection();
        console.log("Date",date);

        const query = `SELECT transaction_number, credit, name, gl_account_id, ci_customer_id FROM temp_transaction WHERE m_at >= ? AND m_at < ? ORDER BY id DESC LIMIT 10`;
        const result = await connection.query(query, [date, date]);
        if (result.length == 0) {
            return 0;
        }
        return result;
        // const query = `SELECT
        //         temp_transaction.description, 
        //         DATE_FORMAT(temp_transaction.m_at, '%Y-%m-%d') as m_at, 
        //         temp_transaction.credit, 
        //         gl_branch.ref_number, 
        //         temp_transaction.ci_customer_id, 
        //         ci_customer.customer_number
        //     FROM gl_branch INNER JOIN pl_account ON gl_branch.id = pl_account.branch_id
        //     INNER JOIN temp_transaction ON temp_transaction.pl_account_id = pl_account.id
        //     INNER JOIN ci_customer ON gl_branch.id = ci_customer.branch_id 
        //     AND pl_account.ci_customer_id = ci_customer.id
        //     WHERE gl_branch.id = ?
        //     AND temp_transaction.m_by = ? 
        //     AND DATE_FORMAT(temp_transaction.m_at, '%Y-%m-%d') = ?`;
        // const result = await connection.query(query, [branch_id,user_id,date]);
        // if (result.length == 0) {
        //     return 0;
        // }
        // return result;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {findTransaction}


