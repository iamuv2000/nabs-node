const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreate')

router.post('/create',(req,res)=>{
    var uid = req.body.uid;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var location = req.body.location;
    userControls.addItem(uid,itemName,itemDesc,location)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

module.exports=router;