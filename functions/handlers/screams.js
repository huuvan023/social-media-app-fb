const { db } = require("./../util/admin");
const { user } = require("firebase-functions/lib/providers/auth");

exports.getAllScreams = (req,res) => {
    db.collection("screams").orderBy("createAt","desc").get()
    .then( data => {
        let screams = [];
        data.forEach( item => {
            screams.push({
                screamID : item.id,
                body: item.data().body,
                userHandle: item.data().userHandle,
                createAt: item.data().createAt,
                userImage: item.data().userImage,
                commentCount: item.data().likeCount,
                likeCount: item.data().commentCount,
            });
        });
        return res.json(screams);
    })
    .catch( error => {
        res.status(500).json({ message: `some thing was wrong! ${error}`})
        console.log(error)
    })
}
exports.postOneScreams = (req,res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createAt: new Date().toISOString(),
        userImage: req.user.imageUrl,
        commentCount: 0,
        likeCount: 0,
    };

    db.collection("screams")
    .add(newScream)
    .then( (rs) => {
        const resScream = newScream;
        resScream.screamID = rs.id;
        res.json({ message: `document ${rs.id   } has been added successfully!` })
    })
    .catch( error => {
        res.status(500).json({ message: `some thing was wrong! ${error}`}); 
        console.log(error)
    })
}

//get Scream
exports.getScream = (req, res) => {
    let screamData = {};
    
    db.doc(`/screams/${req.params.screamID}`)
    .get()
    .then( doc => {
        if( !doc.exists ) {
            return res.status(404).json({ error: "Scream not found!" }) ;
        }  
        screamData = doc.data();
        screamData.screamID = doc.id; 

        return db
        .collection("comments")
        .where("screamID","==", req.params.screamID)
        .get();
        
    })
    .then( data => {
        screamData.comments = [];
        data.forEach((doc) => {
            screamData.comments.push(doc.data());
        });
        return res.json(screamData)
    })
    .catch( error => {
        console.log(error)
        res.status(500).json({ error: error.code })
    })
}

//comment on scream
exports.commentOnScream = ( req,res ) => {
    if( req.body.body.trim() === "" ) {
        return res.status(400).json({ error: "Comment not be empty! "})
    }
    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamID: req.params.screamID,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
    }

    db.doc(`/screams/${req.params.screamID}`).get()
    .then( rs => {
        if( !rs.exists ) {
            return res.status(404).json({ error: "Scream not found! "});
        };
        return rs.ref.update({ commentCount: rs.data().commentCount + 1 });
    })
    .then(() => {
        return db.collection("comments").add(newComment);
    })
    .then(() => {
        return res.json({
            message: "New comment was added!"
        })
    })
    .catch( error => { 
        console.log(error)
        res.status(500).json({ error: "Some thing went wrong!"})
    })
}

//Like scream
exports.likeOnScream = (req, res) => {
    const likeDocument = db.collection("likes").where("userHandle","==", req.user.handle)
            .where("screamID","==",req.params.screamID)
            .limit(1);
    
    const screamDocument = db.doc(`/screams/${req.params.screamID}`);

    let screamData = {};

    screamDocument.get()
    .then( rs => {
        if( !rs.exists ) {
            return res.status(404).json({ error: "Scream not found!" })
        }
        else {
            screamData = rs.data();
            screamData.screamID = rs.id;
            return likeDocument.get();
        }
    })
    .then( rs => {
        if( rs.empty ) {
            return db.collection("likes").add({
                screamID: req.params.screamID,
                userHandle: req.user.handle
            })
            .then(() => {
                screamData.likeCount++;
                return screamDocument.update({ likeCount: screamData.likeCount })
            })
            .then(() => {
                res.json({ message:"Like successfully!" })
            })
        } 
        else {
            res.status(400).json({ error: "Scream already liked! "})
        }
    })
    .catch( error => {
        console.log(error)
        res.status(500).json({ error: error.code })
    })
}

//Unlike scream
exports.unlikeOnScream = (req, res) => {
    const likeDocument = db.collection("likes").where("userHandle","==", req.user.handle)
                .where("screamID","==",req.params.screamID)
                .limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamID}`);

    let screamData = {};

    screamDocument.get()
        .then( rs => {
            if( !rs.exists ) {
                return res.status(404).json({ error: "Scream not found!" })
            }
            else {
                screamData = rs.data();
                screamData.screamID = rs.id;
                return likeDocument.get();
            }
        })
        .then( rs => {
            if( rs.empty ) {
                return res.status(400).json({ error: "Scream not liked! "})
            } 
            else {
                return db.doc(`/likes/${rs.docs[0].id}`).delete()
                .then(() => {
                    screamData.likeCount --;
                    return screamDocument.update({ likeCount: screamData.likeCount })
                })
                .then(() => {
                    res.json({ message:"Unlike successfully!" })
                })
            }
        })
        .catch( error => {
            console.log(error)
            res.status(500).json({ error: error.code })
        })
}


//delete Scream
exports.deleteScream = (req, res) => {
    
    const document = db.doc(`/screams/${req.params.screamID}`);
    document.get()
    .then( rs => {
        if( !rs.exists ) {
            return res.status(404).json({ error: "Stream not found!" })
        }
        if( req.user.handle !== rs.data().userHandle ) {
            return res.status(403).json({ error: "Unauthorized!" })
        }
        return document.delete();
    })
    .then(() => {
        return db.collection("likes").where("screamID","==",req.params.screamID)
            .get()
    })
    .then( doc => {
        doc.forEach( item => {
            db.doc(`/likes/${item.id}`).delete();
        })
        return db.collection("comments").where("screamID","==",req.params.screamID)
        .get()
    })
    .then( doc => {
        doc.forEach( item => {
            db.doc(`/comments/${item.id}`).delete();
        })
        return  res.json({ message:"Scream deleted successfully!"})
    })
    .catch( error => {
        console.log(error)
        res.status(500).json({ error: error.code })
    })
    
}