//recives logic applies logic and calls model function

const bcrypt = require("bcryptjs"); // includes bcrypt library for encripting passwords and jwts
const { createUser, findUserByUsername } = require("../models/RegisterModel"); // imports createUser and findUserByUsername function from RegisterModel
const { handleTokens } = require("./TokenController.js")

const register = async (req, res) => {

    //React will send something like:
    // {
    //   "username": "user1",
    //   "password": "123456"
    // }

    try {
        
        const { username, password } = req.body; //extracts username and password from the request body
        
        //1) check username/password validity
        if(!username.trim()){
            return res.status(400).json({ message: "Invalid Username" }); //returns error if username is missing
        }
        if(!password || password.length<8){
            return res.status(400).json({ message: "Invalid Password" }); //returns error if password is missing/too short
        }

        //2) check if another user with the same name exists
        const existingUser = await findUserByUsername(username);

        if(existingUser){
            return res.status(409).json({ message: "User already exists" });
        }

        //3) encript password
        const salt = await bcrypt.genSalt(10); //generate salts 
        const hashedPassword = await bcrypt.hash(password, salt); // hashes password 

        //4) create new user entry in db
        const newUser = await createUser(username, hashedPassword);

        //5) create and save tokens (handled by TokenController.js)
        const result = await handleTokens(newUser.id, username)

        if(!result.savedRefreshToken){
            res.status(500).json({ message: "Failed to save token"})
        }

        //6)set httpOnly cookies containing tokens
        res.cookie("access_token", result.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //7) Send response to frontend
        res.status(200).json({ message: "User Created Successfully" })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }

};



module.exports = {
    register
}