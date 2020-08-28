const { admin } = require("./admin")
const { db } = require ("./admin")
module.exports = (req,res,next) => {
    let IDToken;
    if( req.headers.authorization && req.headers.authorization.startsWith('HV ') ) {
        IDToken = req.headers.authorization.split("HV ")[1];
    }
    else {
        console.log("No token found!");
        return res.status(403).json({
            error:"Unauthorized"
        })
    }
    admin.auth().verifyIdToken(IDToken)
    .then( decodedToken => {
        req.user = decodedToken;
        return db.collection("users").where("userID","==",req.user.uid)
        .limit(1)
        .get()
    })
    .then( rs => {
        req.user.handle = rs.docs[0].data().handle;
        req.user.imageUrl = rs.docs[0].data().imageUrl;
        return next();
    })
    .catch( error => {
        console.log(error);
        return req.status(403).json({error})
    })
}