const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const User = require('../models/users.model');

function checkAuthenticated(req, res, next) {
    //passport 에서 제공해주는 isAuthenticated
    if(req.isAuthenticated()) {
        //인증이 되어 있으면 미들웨어를 빠져나가게
        return next();
    }

    //안되어 있으면 강제로 로그인 페이지로 리다이렉트
    return res.redirect('/login')
}


//checkAuthenticated 반대개념
//예를 들어 로그인 된 유저가 다시 로그인페이지나 회원가입으로 가려는 경우
function checkNotAuthenticated(req, res, next) {

    if(req.isAuthenticated()) {
        return res.redirect('/posts')
    }
    
    return next();
}

function checkPostOwnerShip(req, res, next) {
    if(req.isAuthenticated()) {
        //로그인 되어 있으면 해당 포스터가 존재하는지
        Post.findById(req.params.id, (err, post) => {
            if(err || !post) {
                req.flash('error', '포스트가 없거나 에러가 발생');
                res.redirect('back');
            }else{
                //포스트가 있는데 내꺼인지 확인
                if(post.author.id.equals(req.user._id)){
                    req.post = post;
                    next();
                }else{
                    req.flash('error', '수정 권한이 없습니다.')
                    res.redirect('back');
                }
            }
        })

    } else{
        req.flash('error', '로그인이 필요합니다');
        res.redirect('/login');
    }
}

function checkCommentOwnerShip(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.commentId, (err, comment) => {
            if(err || !comment) {
                req.flash('error', '댓글이 없거나 에러발생');
                res.redirect('back');
            }else{
                if(comment.author.id.equals(req.user._id)){
                    req.comment = comment;
                    next();
                }else{
                    req.flash('error', '권한 없음');
                    res.redirect('back');
                }
            }
        })
    }else{
        req.flash('error', '로그인이 필요합니다');
        res.redirect('/login')
    }
}


function checkIsMe(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id, (err, user) => {
            if (err || !user) {
                req.flash('error', '유저를 찾는데 에러가 발생했습니다.');
                res.redirect('/profile/' + req.params.id);
            } else {
                if (user._id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', '권한이 없습니다.');
                    res.redirect('/profile/' + req.params.id);
                }
            }
        })
    } else {
        req.flash('error', '먼저 로그인을 해주세요.');
        res.redirect('/login');
    }
}



module.exports = {
    checkIsMe,
    checkCommentOwnerShip,
    checkPostOwnerShip,
    checkAuthenticated,
    checkNotAuthenticated
}