const  admin  = require('firebase-admin');
const firebase = require("firebase")
admin.initializeApp();
const config = require("../util/config")
firebase.initializeApp(config)
//database
const db = firebase.firestore();

module.exports = { admin,db }