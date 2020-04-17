const admin = require('firebase-admin');
const dotenv = require("dotenv");
dotenv.config();

var serviceAccount = require(process.env.CREDS)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
    storageBucket: process.env.STORAGE_BUCKET
});

const database = admin.firestore()
var bucket = admin.storage().bucket();
module.exports = {admin,database,bucket}
