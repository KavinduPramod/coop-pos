const { getConnection } = require('../config/db');

const getUser = async (req, res) => {
    try {
        let username= req.body.name;
        let password= req.body.password;
        let branchid ="";
        let logInUserID;
        const connection = await getConnection();
        const query = `SELECT * FROM it_user_master WHERE user_name = ? and password = ?`;
        const result = await connection.query(query, [username,password]);
        if (result.length == 0) {
            return 0;
        }
        const userData = result[0];
        if (userData.status === 2) {
           return 2;
        }
        branchid =userData.active_branch_id;
        logInUserID =userData.id;
        if (userData.password_status === 1) {
            const branchQuery = `SELECT it_branch_date.id,
                gl_branch.id,
                gl_branch.name_ln1,
                it_branch_date.day_open_date, 
                it_branch_date.day_open_status, 
                it_branch_date.day_end_status
                FROM it_branch_date,gl_branch
                WHERE it_branch_date.branch_id = ? 
                AND gl_branch.id = ?  
                ORDER BY it_branch_date.id DESC LIMIT 1`;
            const branchResult = await connection.query(branchQuery, [branchid,branchid]);
            const branchDetails = branchResult[0];
            if (branchDetails.day_open_status === 0) {
                return 3;
            }
            let data = {
                "code":200,
                "branch_id":branchDetails.id,
                "branch_name":branchDetails.name_ln1,
                "day_open_date":branchDetails.day_open_date,
                "day_open_status":branchDetails.day_open_status,
                "user_id":logInUserID,
                "user_name":userData.name
            }
            return data;
        }else  if(userData.password_status === 0) {
            console.log("New User")
        }
        return result;
    } catch (err) {
        console.log("Error",err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {getUser}
