const functions = require('firebase-functions');

const express = require("express");
const { db } = require("./util/admin")
const app = express();
const { getAllScreams } = require("./handlers/screams");
const { 
    postOneScreams,
    getScream,
    likeOnScream,
    unlikeOnScream,
    deleteScream,
    commentOnScream
        } = require("./handlers/screams");
const { 
    SignUp,
    Login,
    UploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

//import firebaseConfig from './config'
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


//Screams route
app.get("/screams", getAllScreams)
app.post("/scream",FBAuth,postOneScreams)
app.get("/scream/:screamID", getScream )
//comment on a scream
app.post("/scream/:screamID/comment", FBAuth, commentOnScream)
//Like scream
app.post("/scream/:screamID/like", FBAuth, likeOnScream)
//Unlike scream
app.post("/scream/:screamID/unlike", FBAuth, unlikeOnScream)
//Delete scream
app.post("/scream/:screamID/delete", FBAuth, deleteScream)
 

//Sign up
app.post("/signup", SignUp)
//Login route
app.post("/login", Login)
//Update user details
app.post("/user",FBAuth, addUserDetails)
//Get user details
app.get("/user", FBAuth, getAuthenticatedUser)


//UPload image
app.post("/user/image",FBAuth, UploadImage);

exports.api = functions.region("europe-west1").https.onRequest(app);

//Create notification when user like scream
exports.createNotificationOnLike = functions.region("europe-west1").firestore.document("likes/{id}")
.onCreate((snapShot) => {
    return db.doc(`/screams/${snapShot.data().screamID}`)
    .get()
    .then( rs => {
        if( rs.exists && rs.data().userHandle !== snapShot.data().userHandle ) {
            return db.doc(`/notifications/${snapShot.id}`)
            .set({
                recipient: rs.data().userHandle,
                sender: snapShot.data().userHandle,
                read: false,
                screamID:rs.id,
                type: "like",
                createdAt: new Date().toISOString(),
            })
        }
    })
    .catch(error => {
        console.error(error)
    })
})
//Delete notification when user unlike
exports.deleteNotificationOnUnlike = functions.region("europe-west1").firestore.document("likes/{id}")
.onDelete( snapShot => {
    return db.doc(`/notifications/${snapShot.id}`)
    .delete()
    .catch( error => {
        console.error(error);
    }) 
})
//Notification when user comment
exports.createNotificationOnComment = functions.region("europe-west1").firestore.document("comments/{id}")
.onCreate((snapShot) => {
    return db.doc(`/screams/${snapShot.data().screamID}`)
    .get()
    .then( rs => {
        if( rs.exists && rs.data().userHandle !== snapShot.data().userHandle ) {
            return db.doc(`/notifications/${snapShot.id}`)
            .set({
                recipient: rs.data().userHandle,
                sender: snapShot.data().userHandle,
                read: false,
                screamID:rs.id,
                type: "comment",
                createdAt: new Date().toISOString(),
            })
        }
    })
    .catch(error => {
        console.error(error)
    })
})
//Auto change all imageUrl when user change their imageUrl
exports.onUserChangeTheirImageUrl = functions.region("europe-west1").firestore.document("users/{handle}")
.onUpdate((snapShot) => {
    console.log(snapShot.before.data())
    console.log(snapShot.after.data())
    if( snapShot.before.data().imageUrl !== snapShot.after.data().imageUrl ) {
        let batch = db.batch();
        return db.collection("screams").where("userHandle","==",snapShot.before.data().handle)
        .get().then( dt => {
            dt.forEach( item => {
                const scream = db.doc(`/screams/${item.id}`)
                batch.update(scream,{ userImage: snapShot.after.data().imageUrl })
            })
            return batch.commit();
        })
    }
})

