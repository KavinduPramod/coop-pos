const express = require('express')
const {findTransaction} = require('../controller/transactionController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/findTransaction', async (req, res) => {
    try {
        const result = await findTransaction(req, res);
        if (result == 0){
            res.status(404).json({"code":404,"message":"No Transaction Today"});
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"User All Ready LogIn"});
    }
});

module.exports = router
