const {admin,database,bucket} = require('../utils/firebase');
const chalk = require('chalk');
const uniqid = require('uniqid');

//Create user
const createUser = (user)=>{
    return new Promise((resolve, reject)=>{
        const userRef = database.collection('Users').doc(user.uid)
        userRef.set({
            uid: user.uid,
            name: user.name,
            email: user.email,
            userProduct: [],
            barterProduct:[]
        })
        .then(( resp )=>{
            console.log(chalk.green("New user details saved in db"))
            resolve({
                statusCode: 200,
                payload: {
                    msg: "User created",
                },
                wasUserRegistered: false,
                isRegSuccess: true,
            })
        })
        .catch((e)=>{
            console.log(chalk.red("Error in saving user details to db"))
            reject({
                statusCode: 400,
                payload: {
                    msg: "Server Side error contact support"
                },
                wasUserRegistered: false,
                isRegSuccess: false,
            })
        })
       
    })
}

//Check if user uid is valid
const checkUserUid = (uid) => {
    return new Promise((resolve, reject)=>{
        admin.auth().getUser(uid)
            .then((resp)=>{
                console.log(chalk.green("User uid verified!"))
                resolve(resp)
            })
            .catch((err)=>{
                console.log(chalk.red("User uid un-verified!"))
                reject({ error: err.message, message: "Unauthorised"})
            })
    })
}

// Fetch user information
const getUserInfo = (uid)=>{
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Getting user info..."))
        const userRef = database.collection('Users').doc(uid)
        userRef.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                userRef.onSnapshot((doc) => {
                    console.log(chalk.green("User exists!"));
                    console.log(doc.data())
                    resolve(true)
         });
        }
        else{
            resolve(false)
        } 
    }).catch((err)=>{
        console.log(chalk.red("Error in fetching user details!"));
        reject(err)
    })
    })
}

//Post an Item
const addItem = (uid,itemName,itemDesc,location,file) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Creating new item..."))
        var itemId = uniqid();
        location = location.toUpperCase();
        const userRef = database.collection('Users').doc(uid)
        userRef.get()
        .then((docSnapshot) => {
            const itemRef = database.collection('Items').doc(itemId)
            file = Buffer.from(file).toString('base64')
            itemRef.set({
                username : docSnapshot.data().name,
                itemId: itemId,
                uid: uid,
                itemName:itemName,
                itemDesc:itemDesc,
                location:location,
                file,
                DateCreated: new Date(),
            })
            .then((resp)=>{
                const userRef = database.collection('Users').doc(uid)
                userRef.update({
                    userProduct : admin.firestore.FieldValue.arrayUnion(itemId),
                })
                .then(()=>{
                    console.log(chalk.green("Item created!"));
                    resolve({
                        statusCode:200,
                        payload:{
                            Msg:"Item successfully created!"
                        }
                    })
                })   
            })
            .catch((e)=>{
                console.log(chalk.red("Error in creating item"));
                reject(e)
            })
        })
    })
}

//Update an Item
const updateItem = ({uid,itemName,itemDesc,location,file,itemId}) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Updating the item..."))
        const itemRef = database.collection('Items').doc(itemId)
        file = Buffer.from(file).toString('base64')
        itemRef.update({
            itemName:itemName,
            itemDesc:itemDesc,
            location:location,
            file
        })
        .then((resp)=>{
            console.log(chalk.green("Item updated!"));
            resolve({
                statusCode:200,
                payload:{
                    Msg:"Item successfully updated!"
                }
            })
        })
        .catch((e)=>{
            console.log(chalk.red("Error in creating item"));
            reject(e)
        })
    })
}

//Delete item
const deleteItem = ({itemId}) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Deleting the item..."))
        const itemRef = database.collection('Items').doc(itemId)
        itemRef.delete()
        .then((resp)=>{
            console.log(chalk.green("Item deleted!"));
            resolve({
                statusCode:200,
                payload:{
                    Msg:"Item successfully deleted!"
                }
            })
        })
        .catch((e)=>{
            console.log(chalk.red("Error in deleting item"));
            reject(e)
        })
    })
}

//Fetch user's items
const fetchUserItems = (uid) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Fetching the user items..."))
        database.collection('Items').where('uid','==',uid)
        .get()
        .then((snapshot)=>{
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            var data = []
            snapshot.forEach(doc => {
                var obj = doc.data();
                var itemData = {
                    itemId: obj.itemId,
                    uid: obj.uid,
                    itemName: obj.itemName,
                    itemDesc: obj.itemDesc,
                    location: obj.location,
                    file : obj.file
                }
        
                data.push(itemData);
            });
            console.log(chalk.green("Items fetched!"));
            resolve({
                statusCode:200,
                payload:{
                    Msg:"Item successfully fetched!",
                    data: data
                }
            })
        })
        .catch((e)=>{
            console.log(e)
            console.log(chalk.red("Error in fetching item"));
            reject(e)
        })
    })
}

//Fetch user's items
const fetchLocationBasedItems = (location) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Fetching the items..."));
        location = location.toUpperCase();
        database.collection('Items')
        .get()
        .then((snapshot)=>{
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            var data = []
            snapshot.forEach(doc => {
                var obj = doc.data();
                var itemData = {
                    itemId: obj.itemId,
                    itemName: obj.itemName,
                    itemDesc: obj.itemDesc,
                    location: obj.location,
                    file : obj.file,
                    username : obj.username
                }
        
                data.push(itemData);
            });
            console.log(chalk.green("Items fetched!"));
            resolve({
                statusCode:200,
                payload:{
                    Msg:"Item successfully fetched!",
                    data: data
                }
            })
        })
        .catch((e)=>{
            console.log(e)
            console.log(chalk.red("Error in fetching item"));
            reject(e)
        })
    })
}

//Send the user a message
const sendMessage = ({name, email, content, uid_sender ,itemId, itemName}) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Sending message..."));
        messageObj = {
            name, email, content, uid_sender, itemId,itemName
        }
        console.log(messageObj)
        database.collection('Items').doc(itemId)
        .get()
        .then((docSnapshot) => {
            var receiver_uid = docSnapshot.data().uid
            console.log("Receiver uid: " + receiver_uid)
            database.collection('Users').doc(receiver_uid)
            .update({
                barterProduct : admin.firestore.FieldValue.arrayUnion(messageObj), 
            })
            .then(()=>{
                resolve({
                    statusCode:200,
                    payload:{
                        Msg:"Message successfully sent!",
                    }
                })
            })
            .catch((e)=>{
                console.log(e)
            })
        })
        .catch((e)=>{
            console.log(e)
        })
    })
}


//Get my messages
const myMessages = ({uid}) => {
    return new Promise((resolve, reject)=>{
        console.log(chalk.yellow("Fetching messages..."));
        console.log(uid)
        database.collection('Users').doc(uid)
        .get()
        .then((docSnapshot) => {
            console.log(chalk.green("Fetched messages"));
            resolve({
                statusCode:200,
                payload:{
                    Msg:"Message successfully sent!",
                    data: docSnapshot.data().barterProduct
                }
            })
        })
        .catch((e)=>{
            console.log(e)
        })
    })
}


module.exports={
    createUser,
    checkUserUid,
    getUserInfo,
    addItem,
    updateItem,
    deleteItem,
    fetchUserItems,
    fetchLocationBasedItems,
    sendMessage,
    myMessages
}

// .where('location','==',location)