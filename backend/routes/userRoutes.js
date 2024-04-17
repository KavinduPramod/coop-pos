const express = require('express')
const {getUser} = require('../controller/userController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const result = await getUser(req, res);
        if (result == 0){
            res.status(404).json({"code":404,"message":"Not Found User"});
            return;
        }else if (result == 2){
            res.status(404).json({"code":400,"message":"User All Ready LogIn"});
            return;
        }else if (result == 3){
            res.status(201).json({"code":201,"message":"Day End Not Done Your Branch"});
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"User All Ready LogIn"});
    }
});

module.exports = router
