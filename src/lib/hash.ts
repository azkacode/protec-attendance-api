import * as bcrypt from "bcryptjs";

const saltRounds = 10;

class Hash {
    hashCheck(plainTextPassword, storedHashedPassword) {
        try {
            bcrypt.compare(plainTextPassword, storedHashedPassword, function(err, result) {
                if (err) throw new Error(err.message)
                return result ? true : false;
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    hash(plainTextPassword) {
        try {
            bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
                if (err) throw new Error(err.message)
                return hash ? hash : null;
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default new Hash();
