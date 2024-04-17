const express = require('express')
const {findCustomerID} = require('../controller/customerController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/findNIC', async (req, res) => {
    try {
        const result = await findCustomerID(req, res);
        if (result == 0){
            res.status(404).json({"code":404,"message":"Not Found Customer"});
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Something Was Wrong"});
    }
});

module.exports = router
