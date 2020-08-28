const { db,admin } = require("./../util/admin")
const firebase = require("firebase"); 
const config = require("../util/config");
const { user } = require("firebase-functions/lib/providers/auth");
//Check function
const isEmpty = ( string ) => {
    if( string.trim() === "" ) {
        return true;
    }
    else {
        return false;
    }
}
const isEmail = ( string ) => {
    const regEx = "^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$";
    if( string.match(regEx) ) return true;
    return false;
}
const reducerUserDetails = (data) => {
    let userDetails = {};
    console.log(data)
    if( !isEmpty(data.bio.trim()) ) {
        userDetails.bio = data.bio
    };
    if( !isEmpty(data.website.trim()) ) userDetails.website = data.website;
    if( !isEmpty(data.location.trim()) ) userDetails.location = data.location;

    return userDetails;
}

//No image
const noImage = "noImage.png"
//export modules
exports.SignUp = (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    let token;
    let error = {};
    if( isEmpty(newUser.email) ) {
        error.email = "Email must not be emtpy!"
    }
    else if( !isEmail(newUser.email) ) {
        error.email = "Email not valid!";
    }

    if( isEmpty(newUser.password) ) {
        error.password = "Password must not be empty!";
    }
    if( newUser.password !== newUser.confirmPassword ) {
        error.confirmPassword = "Passwords not match!";
    }
    if( isEmpty(newUser.handle) ) {
        error.handle = "Handle must not be empty!";
    }

    if( Object.keys(error).length > 0 ) return res.status(400).json({ error:error });

    db.doc(`/users/${newUser.handle}`).get()
    .then( rs => {
        if( rs.exists ) {
            return res.status(400).json({ handle: "this handle already taken!" })
        }
        else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        }
    })
    .then( data => {
        userID = data.user.uid;
        return data.user.getIdToken();
    })
    .then( token => {
        token = token;
        const userCedentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
            userID
        }
        db.doc(`/users/${newUser.handle}`)
        .set(userCedentials)
        return token;
    })
    .then( (token) => {
        res.status(201).json({
            token
        })
    })
    .catch ( error => {
        console.log(error);
        //split code to 2 part
        let code = error.code.split("/");
        let search = '-';
        let replaceWith = ' ';
        //replace all "-" character to " "
        let result = code[1].split(search).join(replaceWith);
        res.status(500).json({
            //UpperCase the first character in string
            message: result.charAt(0).toUpperCase() + result.slice(1),
        })
    })
}

exports.Login = (req,res) => {
    const user = { 
        email : req.body.email,
        password : req.body.password,
    }
    let error = {};
    if( isEmpty(user.email) ) {
        error.email = "Email must not be empty!"
    }
    if( isEmpty(user.password) ) {
        error.email = "Password must not be empty!"
    }

    if( Object.keys(error).length > 0 ) return res.status(400).json({ error });

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then((rs) => {
        return rs.user.getIdToken();
    })
    .then((token) => {
        return res.json({ token : token });
    })
    .catch ( error => {
        console.log(error);
        //split code to 2 part
        let code = error.code.split("/");
        let search = '-';
        let replaceWith = ' ';
        //replace all "-" character to " "
        let result = code[1].split(search).join(replaceWith);
        res.status(500).json({
            //UpperCase the first character in string
            message: result.charAt(0).toUpperCase() + result.slice(1),
        })
    })
}
exports.UploadImage = (req,res) => {
  
    const Busboy = require("busboy");
  
    const path = require("path");
  
    const os = require("os");
  
    const fs = require("fs");
  
    const busboy = new Busboy({ headers: req.headers });
  
    let imageToBeUploaded = {};
    let imageFileName;
    if( req.headers['content-length'] / 1024 > 5000 ) {
        res.status(400).json({
            error: "This file is too large!"
        })
    }
    busboy.on("file", (fieldName, file, fileName, enCoding, mimeType) => {
        if( mimeType !== "image/jpeg" && mimeType !== "image/jpg" && mimeType !== "image/png" ) {
            return res.status(400).json({
                error: "Only .jpeg or .jpg or .png are allowed !",
            })
        }
        const imageExtension = fileName.split(".")[fileName.split(".").length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = { filePath, mimeType };
        file.pipe(fs.createWriteStream(filePath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contenType: imageToBeUploaded.mimeType
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`users/${req.user.handle}`).update({ imageUrl: imageUrl });
        })
        .then(() => {
            return res.json({ message: "Image uploaded successfully!" });
        })
        .catch( error => {
            console.log(error);
            return res.status(400).json({ error: error.code })
        })
    })
    busboy.end(req.rawBody);    
}

exports.addUserDetails = (req, res) => {
    let userDetails = reducerUserDetails(req.body);
    console.log(userDetails)
    db.doc(`users/${req.user.handle}`).update(userDetails)
    .then(() => {
        return res.status(200).json({
            message: "Details added successfully!",
        });
    })
    .catch( error => {
        console.log(error);
        res.status(400).json({
            error: error.code
        });
    });
}

//get all user details
exports.getAuthenticatedUser = (req, res) => { 
    //user Data
    console.log(req.user.handle)
    let uData = {};
    db.doc(`users/${req.user.handle}`).get()
    .then( rs => {
        if( rs.exists ) {
            uData.cedentials = rs.data();
            return db.collection("likes")
            .where("userHandle","==",req.user.handle)
            .get()
        }
    })
    .then( data => {
        uData.likes = [];
        data.forEach( item => {
            uData.likes.push(item.data());
        })
        return db.collection("notifications").where("recipient","==",req.user.handle)
            .orderBy('createdAt','desc').limit(10).get()
    })
    .then( data => {
        uData.notifications = [];
        data.forEach( i => {
            uData.notifications.push({
                recipient: i.data().recipient,
                sender:  i.data().sender,
                read:  i.data().read,
                screamID:  i.data().screamID,
                type:  i.data().type,
                createdAt:  i.data().createdAt,
                notificationsID: i.id
            });
        })
        return res.json({ uData })
    })
    .catch( error => {
        console.log(error)
        return res.status(400).json({ error: error.code })
    })
}