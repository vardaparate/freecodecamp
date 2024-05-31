const express = require('express');
const router = express.Router();

router.post('/ourInfo', (req, res) => {
    try {
        console.log(global.list_items);
        res.send([global.list_items]);
    }
    catch(error) {
        console.log(error.message);
        res.send("server error");
    }
})

module.exports = router;