const {admin,database} = require('../utils/firebase')
const chalk = require('chalk')

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

module.exports={
    createUser,
    checkUserUid,
    getUserInfo
}