const { getConnection } = require('../config/db');

const findCustomerID = async (req, res) => {
    try {
        let id= req.body.id;
        let branch_id =req.body.branch_id;
        let type= req.body.id_type;
        const connection = await getConnection();
        const query = `SELECT ci_customer.id as ciCustomerID,ci_customer.customer_number,ci_customer.nic,ci_customer.title_ln1,
                        ci_customer.full_name_ln1,pl_account.ref_account_number,pl_account.id  as plAccountId,ci_customer.address_ln1
                        FROM ci_customer
                        INNER JOIN pl_account ON ci_customer.id = pl_account.ci_customer_id
                        WHERE nic = ? OR customer_number = ? AND ci_customer.branch_id = ?`;
        const result = await connection.query(query, [id,id,branch_id]);
        if (result.length == 0) {
            return 0;
        }
        let customer_title;
        let customer_id;
        let customer_name;
        let customer_nic;
        let customer_number;
        let customer_address;
        let ref_account_numbers = [];

        for (const key in result){
            customer_title = result[key].title_ln1;
            customer_id = result[key].ciCustomerID;
            customer_name = result[key].full_name_ln1;
            customer_nic = result[key].nic;
            customer_number = result[key].customer_number;
            customer_address = result[key].address_ln1;
            ref_account_numbers.push({
                "pl_account_id":result[key].plAccountId,
                "ref_account_number":result[key].ref_account_number,
            });
        }
        // console.log("WORKING...");
        // console.log(customer_address);
        const JSON_VALUE ={
            "title" : customer_title,
            "id" : customer_id,
            "name" : customer_name,
            "nic" : customer_nic,
            "customer_number" : customer_number,
            "cust_address" : customer_address,
            "refNumbers" : ref_account_numbers,
        }
        return JSON_VALUE;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {findCustomerID}
