const router = require('express').Router();
const apiRoutes = require('./api.routes')

router.use(process.env.API_URL, apiRoutes);
router.use('/', (req, res)=>{
  res.status(200).json({message:`success-${req.originalUrl} Found`})
});
router.use(process.env.API_URL, (req, res) =>
  res.status(404).json({message:`Error-${req.originalUrl} Not Found`})
);

module.exports = router;