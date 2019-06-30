const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const passport = require("passport");


const validateRegistration = require('../../validation/register');
const validateLogin = require('../../validation/login');

const User = require('../../models/User');
const mongoose = require('mongoose');

const moment = require('moment');

//protected route
router.get("/getbudgets", (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) return res.send(err);
        if (user) { 
            User.findOne({email: user.email})
                .then(user => res.json({budgets: user.budgets}));
            return;
        }
        return res.status(401).json({message: info.message});
    })(req, res, next); //closure to get access to req,res,next
});


//protected route
router.post("/addtransaction", (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) return res.send(err);
        if (user) { 
            info = req.body.info;
            info.id = mongoose.Types.ObjectId();

            budgets = getNewBudgets(user, info);

            User.findOneAndUpdate({email: user.email}, {$push: {transactions: info}, $set: {budgets}}, {useFindAndModify: false, new: true})
                .then(user => {res.json({transactions: user.transactions})})
                .catch(err => res.send(err));
            return;
        }
        return res.status(401).json({message: info.message});
    })(req, res, next); //closure to get access to req,res,next
});


//protected route
router.get("/gettransactions", (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) return res.send(err);
        if (user) { 
            User.findOne({email: user.email})
                .then(user => res.json({transactions: user.transactions}));
            return;
        }
        return res.status(401).json({message: info.message});
    })(req, res, next); //closure to get access to req,res,next
});



//protected route
router.post("/addcategory", (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) return res.json(err);
        if (user) { 
            const info = req.body.info;
            const budgetType = req.body.budgetType
            info.id = mongoose.Types.ObjectId();

            //check if category exists
            let add = true;
            let arr = user.budgets[budgetType].categories;
            arr.forEach(categoryDict => {
                if (add && categoryDict.name === info.name) {
                    add = false;
                }
            });
            if (add) {
                const categoryKey = "budgets." + budgetType + ".categories"
                const totalKey = "budgets." + budgetType + ".budget";
                const newCategories = arr.concat([info]);
                const newBudget = user.budgets[budgetType].budget + info.budget;

                //Used $set and updateOne instead of $push and findAndUpdateOne
                //b/c of issues with updating nested arrays in MongoDB
                User.updateOne({email: user.email}, {$set: {[categoryKey] : newCategories, [totalKey] : newBudget}})
                    .then(message => {
                        if (message.nModified === 1) {
                            User.findOne({email: user.email})
                                .then(user => {
                                    let weekly = user.budgets.weekly.categories;
                                    let monthly = user.budgets.monthly.categories;
                                    let yearly =user.budgets.yearly.categories;
                                    res.json({categories: {weekly: weekly, monthly : monthly, yearly: yearly}});
                                })
                        } else {
                            res.json({message});
                        }
                    })
                    .catch(err => res.json(err));
                  return;              
            } else {
                return res.json({categoryExists : true});
            }
        }
        return res.status(401).json({message: info.message});
    })(req, res, next); //closure to get access to req,res,next
});


//protected route
router.get("/getcategories", (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err) return res.send(err);
        if (user) { 
            User.findOne({email: user.email})
                .then(user => {
                    let weekly = user.budgets.weekly.categories;
                    let monthly = user.budgets.monthly.categories;
                    let yearly =user.budgets.yearly.categories;
                    res.json({categories: {weekly: weekly, monthly : monthly, yearly: yearly}});
                });
            return;
        }
        return res.status(401).json({message: info.message});
    })(req, res, next); //closure to get access to req,res,next
});
 

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegistration(req.body);
    if (!(isValid)) {
        return res.status(400).json(errors);
    }
    User.findOne({email: req.body.email}).then(
        user => {
            if (user) {
                return res.status(400).json({emailExists: "Email already exists."});
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) { throw err }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => sendUserInfo(user, res))
                            .catch(err => res.json(err));
                    });
                });
            }
        }
    );
});


router.post('/login', (req, res) => {
    const {errors, isValid} = validateLogin(req.body);
    if (!(isValid)) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user => {
        if (!user) {
            return res.status(404).json({emailNotFound: "Email not found."});
        }

        bcrypt.compare(password, user.password).then(isEqual => {
            if (isEqual) {

                user = updateHistory(user);
                User.updateOne({email: user.email}, user)
                    .then(message => {
                        if (message.nModified === 1) {
                            console.log("History updated.")
                        }
                    })
                    .catch(err => res.json(err));

                sendUserInfo(user, res);
            } else {
                return res.status(400).json({passwordIncorrect: "Password incorrect."})
            }
        });
    });
});






function sendUserInfo(user, res) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
    }
    jwt.sign(
        payload,
        keys.secretOrKey,
        {
            expiresIn: 604800
        },
        (err, token) => {
            if (err) { throw err }
            res.json({
                success: true,
                token: "Bearer " + token,
                user: payload
            });
        }
    );
}


function getNewBudgets(user, info) {
    let weekly = user.budgets.weekly;
    let monthly = user.budgets.monthly;
    let yearly = user.budgets.yearly;

    if (moment(info.date).isSameOrAfter(moment().subtract(1, 'weeks'))) {

        weekly.categories.forEach((item, index) => {
            if (info.category === item.name) {
                weekly.categories[index].actual -= info.amount;
                weekly.actual -= info.amount;
            }
        });
        
        monthly.categories.forEach((item, index) => {
            if (info.category === item.name) {
                monthly.categories[index].actual -= info.amount;
                monthly.actual -= info.amount;
            }
        });

        yearly.categories.forEach((item, index) => {
            if (info.category === item.name) {
                yearly.categories[index].actual -= info.amount;
                yearly.actual -= info.amount
            }
        });
    
    } else if (moment(info.date).isSameOrAfter(moment().subtract(1, 'months'))) {
        monthly.categories.forEach((item, index) => {
            if (info.category === item.name) {
                monthly.categories[index].actual -= info.amount;
                monthly.actual -= info.amount;
            }
        });

        yearly.categories.forEach((item, index) => {
            if (info.category === item.name) {
                yearly.categories[index].actual -= info.amount;
                yearly.actual -= info.amount
            }
        });
    } else if (moment(info.date).isSameOrAfter(moment().subtract(1, 'years'))) {
        yearly.categories.forEach((item, index) => {
            if (info.category === item.name) {
                yearly.categories[index].actual -= info.amount;
                yearly.actual -= info.amount
            }
        });
    }
    return {weekly, monthly, yearly};
}



function updateHistory(user) {
    let history  = user.history
    if (moment().weekday() === 0) {
        const obj =  {
            date: moment().subtract(1, 'weeks').format("YYYY-MM-DD").toString(),
            budget: JSON.parse(JSON.stringify(user.budgets.weekly))
        }
        let add = true;
        history.weekly.forEach(week => {
            if (week.date == obj.date) {
                add = false;
            }
        });
        if (add) {
            history.weekly.push(obj);
            user.budgets.weekly.actual = 0;
            user.budgets.weekly.categories.forEach(categoryDict => categoryDict.actual = 0);
        }
    }
    if (moment().date() === 27) {
        const obj = {
            date: moment()
                    .subtract(1, 'month').format("MM-YYYY").toString(),
            budget: JSON.parse(JSON.stringify(user.budgets.monthly))
        }
        let add = true;
        history.monthly.forEach(month => {
            if (month.date == obj.date) {
                add = false;
            }
        });
        if (add) {
            history.monthly.push(obj);
            user.budgets.monthly.actual = 0;
            user.budgets.monthly.categories.forEach(categoryDict => categoryDict.actual = 0);
        }

    }
    if (moment().dayOfYear() === 1) {
        const obj = {
            date: moment()
                    .subtract(1, 'year').format("YYYY").toString(),
            budget: JSON.parse(JSON.stringify(user.budgets.yearly))
        };
        let add = true;
        history.yearly.forEach(year => {
            if (year.date == obj.date) {
                add = false;
            }
        });
        if (add) {
            history.yearly.push(obj);
            user.budgets.yearly.actual = 0;
            user.budgets.yearly.categories.forEach(categoryDict => categoryDict.actual = 0);
        }
    }
    user.history = history;
    return user;
}

module.exports = router;