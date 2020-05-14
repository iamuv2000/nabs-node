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

//Send a message
router.post('/sendMessage', (req,res)=>{

    messageObj ={
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
        uid_sender : req.body.uid_sender,
        itemId: req.body.itemId,
        itemName: req.body.itemName
    }

    userControls.sendMessage(messageObj)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

//Get all messages
router.post('/myMessages', (req,res)=>{
    userControls.myMessages({uid: req.body.uid})
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})


module.exports=router;