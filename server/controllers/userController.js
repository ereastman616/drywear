const { pool } = require('../config');
const bcrypt = require('bcryptjs');

const userController = {};

userController.verifyUser = (req, res, next) => {
    const username = req.body.username; 

    pool.query('SELECT * FROM "user" WHERE username = $1', [username], (err, result) => {
        if (err || !result) {
            console.log('No such username')
            // res.redirect('/login');
            return;
        }
        
        bcrypt.compare(req.body.password, result.rows[0].password, (err, isMatch) => {
            if (err || !isMatch) {
                console.log('Wrong password')
                // res.redirect('/login');
                return; 
            }

            if (isMatch) {
                console.log('Right password!')
                // res.redirect('/');
                return next();
            }
        });
    });
}

userController.createUser = (req, res, next) => {

}

module.exports = userController;