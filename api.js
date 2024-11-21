
const express = require('express');

const router = express.Router();

module.exports = router;

router.get('/', (req, res) => {
    res.send ('Mobile API');
})

const mongoose = require('mongoose');

const cakeModel = require('./cakeModel');

const COMMON = require('./COMMON');

router.get('/list', async (req, res) => {
    await mongoose.connect(COMMON.uri);
    let cake = await cakeModel.find();
    console.log(cake);
    res.send(cake);
})