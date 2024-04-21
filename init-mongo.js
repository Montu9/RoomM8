db.auth("admin-user", "AdminPassword")

db.createUser(
  {
    user: "user",
    pwd: "SecretPassword",
    roles: [
	{
	  role: "readWrite",
	  db: "Roommate"
	}
    ]
  }
)
