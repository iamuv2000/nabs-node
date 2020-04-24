const router = require("express")();
const userControls = require('../controllers/userControls');
const userCreate = require('../middlewares/user/userCreate')

//Create a new user
router.post('/create',userCreate,(req,res)=>{
    userControls.createUser(req.user)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

//Fetch user's items
router.post('/myItems',(req,res)=>{

    userControls.fetchUserItems(req.body.uid)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

//Fetch location based items
router.post('/allItems', (req,res)=>{
    userControls.fetchLocationBasedItems(req.body.location)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

module.exports=router;