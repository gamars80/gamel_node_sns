const express = require('express');
const passort = require('passport');
const User = require('../models/users.model');
const sendMail = require('../mail/mail');
const usersRouter = express.Router();

usersRouter.post('/login', (req, res, next) => {
    //passport에서 제공하는 authenticate 전략중 이메일,비밀번호 형식인 local 전략
    passort.authenticate("local", (err, user , info) => {
        //에러가 있으면 express 에러처리기로 next
        if(err) next(err); 

        //유저가 없으면 info로 넘어온 메세지를 전달
        if(!user) {
            return res.json({msg:info});
        }
        
        //passport에서 제공하는 login
        req.logIn(user , function(err){
            if(err) return next(err);

            res.redirect('/posts')
        })

    })(req, res, next) // 미들웨어 안에 또 passport미들웨어가 있기에 req,res,next를 passport 미들웨어가 사용할수 있도록
})


usersRouter.post('/signup', async (req, res) => {
    //User 객체 생성
    const user = new User(req.body);
    
    try{
        // 몽고 db user 컬렉션에 user를 저장한다
        await user.save();

        //가입인사 이메일 보내기
        sendMail('gamars803@gmail.com', '엉남이', 'welcome');
        res.redirect('/login');
    } catch(error) {
        console.error(error);
    }
});

usersRouter.post('/logout', (req, res, next) => {
    //passport에서 제공하는 req.logOut 이용
    req.logOut(function(err) {
        if(err) return next(err);
    })

    res.redirect('/login');
});

//passport의 authenticate google 전략 사용
usersRouter.get('/google', passort.authenticate('google'));

//구글에서 로그인 성공시 처리하는 콜백 url 에 대한 처리
usersRouter.get('/google/callback', passort.authenticate('google',{
    successReturnToOrRedirect: '/',
    failueRedirect: '/login'
}));


usersRouter.get('/kakao', passort.authenticate('kakao'));

usersRouter.get('/kakao/callback', passort.authenticate('kakao', {
    successReturnToOrRedirect: '/posts',
    failureRedirect: '/login'
}));

module.exports = usersRouter;
