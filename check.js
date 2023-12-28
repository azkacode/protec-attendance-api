const bcrypt = require('bcryptjs');
const saltRounds = 10;


const plainTextPassword = 'adminadmin'; // This is the password entered by the user
const storedHashedPassword = '$2y$10$1qrXzv0DdqXuA9NdF4xJe.JBmsFSG1MjlNgHt.sY.jT.r6wAbYSwS'; // Retrieve the hashed password from your database

// bcrypt.compare(plainTextPassword, storedHashedPassword, function(err, result) {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     if (result) {
//         console.log('Password is correct');
//     } else {
//         console.log('Password is incorrect');
//     }
// });


bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    }
    console.log(hash);
});