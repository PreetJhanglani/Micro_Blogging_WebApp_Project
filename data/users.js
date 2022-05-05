const mongoCollections = require('../config/mongoCollection')
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const validate = require('../validation/userValidate');
<<<<<<< Updated upstream
=======
const courses_func = require('./courses');
const courses = mongoCollections.courses;
>>>>>>> Stashed changes


module.exports = {

    async createUser(name, email, password, gender, age, userType){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        validate.validatePassword(password);
        password = password.trim();
        validate.validateName(name);
        name = name.trim();
        validate.validateGender(gender);
        gender = gender.trim();
        validate.validateAge(age);
        age = Number(age);
        validate.validateUserType(userType);
        userType = Number(userType); 

        const userCollection = await users();
        const duplicateEmail = await userCollection.findOne({email: email});
        if(duplicateEmail !== null) throw "There is already a user with that email";
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newId = ObjectId();
        let newUser = {
            _id: newId,
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            age: age,
            userType: userType,
            courses: [],
        };

        const insertUser = await userCollection.insertOne(newUser);
        if(insertUser.insertedCount === 0) throw "Could not add email";
        return {userInserted : true};
    },

    async checkUser(email, password) {  
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        validate.validatePassword(password);
        password = password.trim();

        const userCollection = await users();
        const duplicateEmail = await userCollection.findOne({email: email});
        if(duplicateEmail == null) throw "Either the email or password is invalid";

        let passwordCompareToMatch = await bcrypt.compare(password, duplicateEmail.password);
        if(passwordCompareToMatch) {
            return {userExists : true}
        } else {
            throw "Either the email or password is invalid";
        } 
    },

    async getUser(email){
        console.log('inside getuser, mail:',email)
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (user === null) throw 'No such user found';
        return user;
    },
<<<<<<< Updated upstream

=======
 
    async enroll(email,course_name){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        // console.log(course_name)
        let course_info = await courses_func.getCourseByName(course_name)
        console.log(course_info)
        if(!course_info){
            throw "Course not found"
        }
        else{
        const found = user.courses.some(el => el._id.equals(course_info._id))
        console.log(found)
        if (!found){
            user.courses.push(course_info)
            let update = await userCollection.updateOne({email:email},[{$set:{courses : user.courses}}])
            if (update.modifiedCount === 0){
                throw "Couldnt Enroll"
            }
            else{
                console.log({"Enrolled":true})
            }
        }
        else{
            throw "Already Enrolled"
        }
    }
        
    },
    async getprogress(email,course_name){
        email = email.trim();
        email = email.toLowerCase();
        // const userCollection = await users();
        // const user = await userCollection.findOne({email: email});
        const userCollection = await users()
        const coursedata = await courses_func.getCourseByName(course_name)
        // console.log(coursedata._id)
        let courseinfo = await userCollection.find({ email:email },{courses:{$elemMatch:{_id:coursedata._id} }, "courses.videos":1}).toArray();
        // console.log(courseinfo[0].courses)
        for(var i of courseinfo[0].courses){
            // console.log(i._id)
            if(i._id.equals(coursedata._id)){
                // console.log("IF")
                var data = i.videos
            }
        }
        // console.log(data);
        count = 0
        for(var i = 0; i < data.length; i++){
            if(data[i].done === true){
                count += 1
            }
        }
        var arr = []
        var obj = {}
        obj[course_name] = parseInt(count*100/data.length)
        arr.push(obj)
        return arr
    },

    async get_user_course_progress(email){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email},{$project:{courses:1}});
        // console.log(user)
        var prog_data = []
        for (var i of user.courses){
            if (i.courseName){
                let prog = await this.getprogress(email,i.courseName)
                prog_data.push(prog)
            }
        }
        return prog_data
    },
     
    async editUserInfo(email, name, gender, age){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        let newName;
        let newGender;
        let newAge;
        var user = this.getUser(email);

        if(!name || typeof(name)=='undefined'){
            newName = user.name
        }else{
            newName = name;
        }
        validate.validateName(newName);
        newName = newName.trim();

        if(!gender || typeof(gender)=='undefined'){
            newGender = user.gender
        }else{
            newGender = gender;
        }
        validate.validateGender(newGender);
        newGender = newGender.trim();
        
        if(!age || typeof(age)=='undefined'){
            newAge = user.age
        }else{
            newAge = age;
        }
        validate.validateAge(newAge);
        newAge = Number(newAge);

        const userCollection = await users();
        const updatedBandName = {
            name: newName,
            gender: newGender, 
            age: newAge,
        };

        const updatedInfo = await userCollection.updateOne(
            { _id: user.id },
            { $set: updatedBandName }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update the user';
        }

        return await this.getUser(email);
    }

}

async function main(){
    console.log(await module.exports.getUser("pjhangl1@stevens.edu"))
}
>>>>>>> Stashed changes

}