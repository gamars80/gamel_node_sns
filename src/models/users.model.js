const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        minLength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    kakaoId: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    firstName:{
        type: String,
        default: 'First Name'
    },
    lastName: {
        type: String,
        default: 'Last Name'
    },
    bio: {
        type: String,
        default: '데이터 없음'
    },
    hometown: {
        type: String,
        default: '데이터 없음'
    },
    workspace: {
        type: String,
        default: '데이터 없음'
    },
    education: {
        type: String,
        default: '데이터 없음'
    },
    contact: {
        type: String,
        default: '데이터 없음'
    },
    friends: [{type: String}],
    friendsRequests: [{type: String}]


},{timestamps: true})

const soltRounds = 10;

//mongoose에서 제공하는 뭐뭐 하기 전에 실행하도록 하는 pre 메소드
userSchema.pre('save', function (next) {
    let user = this;

    //비밀번호가 변경될때만
    if(user.isModified('password')) {
        //salt 생성
        bcrypt.genSalt(soltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
            
        })
    }else{
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // if(plainPassword  === this.password) {
    //     cb(null, true);
    // }
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = User;