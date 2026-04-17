# All-Auth
This project is an implementation of an authentication system built fully from scratch, that tries to be as professional as possible. 
The goal was to learn about authentication, how it works and how to implement it in a real application.

## AuthContext
The entire app is wrapped in a AuthProvider component which make the AuthContext available to all other components. The context contains only the isAuthed variable which tells the app whether the user is signed in or not (more on that later). The main (and in this implemantation the only) component that uses this variable is ProtectedRoute, a component which, as the name says, devides routes that need to be protected by authentication, from the /register route.
If a user is not signed in he is redirected to the /register route.

## Tokens
This is the core of the project. To authenticate the users correctly i have implemented 2 tokens: an access token and a refresh token.
The access token is used to authenticate the user quickly while the user is using the app. It lasts only 15min, reducing the impact of a potential thefth. It is used by simply verifyng it using the jwt.verify() function in the backend.
The refresh token is, instead, used to keep the user logged in for longer and have a higher level of security. It lasts 7d and is stored in the db, which allows for further verification when it is used to check the authentity of a user. Whenever a user access token fails to be verified or is not sent by the browser the backend queries the db to see if the refresh token is correct. If it is it will get rotated, and the new refresh token will be sent back to the client with an access token, at this point the user is considered to be authenticated.

## Database
As I said in the section about tokens, the refresh token is stored in a database. The database schema is really simple, there are only 2 tables one for users and one for refresh tokens. The main focus of the database is the foreign key in the tokens table which connects the 2 tables toghether. 

## Logout
From the Dashboard users can logout of their account. This eliminates their respective refresh token entry from the database, requiring them to login the next time they want to see the dashboard. Logging in checks for the existance of the user and the correctnes of the password, than creates an access and a refresh tokens which are both sent to the client as HTTPONLY cookies, while only the refresh token is saved in a new db entry.

## General Structure

