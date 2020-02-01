const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreate')

router.post('/create',userCreate,(req,res)=>{
    userControls.createUser(req.user)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

module.exports=router;