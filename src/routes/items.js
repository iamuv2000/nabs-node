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

    userControls.addItem(uid,itemName,itemDesc,location,req.file.buffer)
    .then(resp=>res.status(200).send(resp))
    .catch(err => res.status(400).send(err))
})

module.exports=router;