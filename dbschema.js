let db = {
    screams: [
        {
            userHandle: 'user',
            body: 'this scream body',
            createdAt: "2020-08-22T05:33:05.741Z", 
            likeCount: 5,
            commentCount: 2,
            
        },

    ],
    comments: [
        {
            userHandle: "user",
            screamID: "id",
            body: "van dep trai",
            createAt: "=))"
        }
    ],
    user : [
        {
            userID: 'blabla',
            email: "bla@gmail.com",
            handle: "user",
            createAt: "date when was created",
            imageURL: "link image url",
            bio: "biology",
            website: "",
            location: "location"
        },
    ],
    notification: [
        {
            recipient: "user",
            sender: "user 1",
            read: "true || false",
            screamID: "scream",
            type: "like || comment",
            createdAt: "time"
        }
    ]
}

const userDetails = {
    //redux data
    credentials : {
        userID: 'blabla',
        email: "bla@gmail.com",
        handle: "user",
        createAt: "date when was created",
        imageURL: "link image url",
        bio: "biology",
        website: "",
        location: "location"
    },
    likes: [
        {
            userHandle: "user",
            screamID: "id"
        },
        {
            userHandle: "user",
            screamID: "id"
        }
    ]
}