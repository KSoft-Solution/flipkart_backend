const router = require("express").Router();

const userRoute = require('./auth.routes')

router.use('/user',userRoute)

module.exports = router;
