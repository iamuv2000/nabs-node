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
                    console.log(doc._fieldsProto)
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
        var id = uniqid();
        const itemRef = database.collection('Items').doc(id)
        file = Buffer.from(file).toString('base64')
        itemRef.set({
            item_id: id,
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
                userProduct: admin.firestore.FieldValue.arrayUnion(id)
            })
            .then((resp)=>{
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
}

module.exports={
    createUser,
    checkUserUid,
    getUserInfo,
    addItem
}