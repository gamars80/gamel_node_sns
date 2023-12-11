const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');
const config = require('config');
const mainRouter = require('./routes/main.router');
const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');
const commentsRouter = require('./routes/comments.router');
const profileRouter = require('./routes/profile.router');
const likeRouter = require('./routes/likes.router');
const firendsRouter =require('./routes/friends.router');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport'); 
const serverConfig = config.get('server');

require('dotenv').config();

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY]
}));

// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

//패스포트를 이용하기위한 미들웨어 등록
app.use(passport.initialize());
app.use(passport.session());

//분리한 passort.js 를 require한다
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//정적 파일 미들웨어 사용 설정
app.use(express.static(path.join(__dirname, 'public')));

//에러처리기 미들웨어
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "서버 에러 발생");
})

//connect-flash 미들웨어 등록
app.use(flash());

app.use(methodOverride('_method'));

//view 엔진 ejs 셋팅
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//몽고 커넥션
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('mongodb connected');
    
}).catch((err) => {
    console.log(err);
});

app.get('/send', (req, res) => {
    req.flash('post success', '포스트가 생성되었습니다');
    res.redirect('/receive')
})

app.get('/receive', (req, res) => {
    res.send(req.flash('post success')[0])
})

//res.localst의 프로퍼티를 이용해서 에러와 
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user
    next();
})

//라우터들 등록
app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/comments', commentsRouter);
app.use('/profile/:id', profileRouter);
app.use('/friends', firendsRouter);
app.use(likeRouter);



const port = serverConfig.get('port');

app.listen(port, (req, res) => {
    console.log(`Listening On ${port}`);
})

