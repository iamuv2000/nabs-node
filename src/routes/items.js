const router = require("express")();
const userControls = require('../controllers/userControls');
const multer = require('multer');

//Handling image upload - Multer middleware
const upload = multer({
    limits: {
        fileSize: 1000000000000
    }
}) 


//Creating a new item
router.post('/create' ,upload.single('img_file'), (req,res)=>{
    console.log(req.file)
    var uid = req.body.uid;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
	var location = req.body.location;
	var expectedPrice = req.body.expectedPrice
	var category = req.body.category

    userControls.addItem(uid,itemName,itemDesc,location,req.file.buffer,expectedPrice, category)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

//Updating a new item
router.post('/update' ,upload.single('img_file'), (req,res)=>{
    console.log(req.file);

    var item = {
        itemName : req.body.itemName,
        itemDesc : req.body.itemDesc,
        location : req.body.location,
        file : req.file.buffer,
        itemId : req.body.itemId
    }

    userControls.updateItem(item)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

//Delete item
router.post('/delete' , (req,res)=>{
   
    var deleteItem = {
        itemId : req.body.itemId,
    }

    userControls.deleteItem(deleteItem)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

module.exports=router;