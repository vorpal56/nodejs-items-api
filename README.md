Learning Node.js using routes, route guarding, JWT, SQLite3 DB, and async/await. Firebase is better for handling authentication since it's free, but this is just for learning purposes.

Start both `index.js` and `authServer.js` in two separate consoles:
```
npm run start
npm run auth
```

General process for users (similar to items):
1. `POST` to `/user` with `name`, `username`, and `password` (creating a new user)
2. `GET /user` which returns all users
3. `POST` to the Authentication Server at `/login` using an accounts `username` and `password` to retrieve the `accessToken`
4. `PUT` to `/user/<userID>` using the `accessToken` in the `Authorization` header with `name`, `username`, and optional `password` to update the user information
5. `POST` to the Authentication Server at `/login` using the new account information
6. `DELETE` to `/user/<userID>` to delete the user from the table