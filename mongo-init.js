db.createUser(
    {
        user: "admin",
        pwd: "1234",
        roles: [
            {
                role: "readWrite",
                db: "sites"
            }
        ]
    }
);
