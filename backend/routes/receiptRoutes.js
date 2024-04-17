const express = require('express')
const {
    findCustomerRefAccountNo,
    saveReceiptDetails
} = require('../controller/receiptController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/findCustomerRefAccountNo', async (req, res) => {
    try {
        const result = await findCustomerRefAccountNo(req, res);
        if (result == 0){
            res.status(404).send("Not Found Customer");
            return;
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/saveReceiptDetails', async (req, res) => {
    try {
        const result = await saveReceiptDetails(req,res);
        if (result == 0){
            res.status(404).send({"code":404,"message":"Can't Complete Transaction"});
            return;
        }
        res.status(200).send({"code":200,"message":"Successfully Saved Transaction"});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/requestData', async (req, res) => {
    try {
        res.status(200).send("Successfully Saved Transaction");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router
