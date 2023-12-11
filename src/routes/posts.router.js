const express = require('express');
const { checkAuthenticated, checkPostOwnerShip } = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const multer = require('multer');
const path = require('path');

const storageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,  path.join(__dirname, '../public/assets/images'))
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({storage:storageEngine}).single('image');

router.post('/', checkAuthenticated, upload, (req, res, next) => {
    let desc = req.body.desc;
    let image = req.file ? req.file.filename : "";
    
    Post.create({
        image: image,
        description: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, _) => {
        if(err) {
            req.flash('error','포스트 생성 실패');
            res.redirect("back");
            // next(err);
            //또는 에러페이지를 만들어서 에러 페이지로 보내고 에러를 표현해줘도 된다
        }else{
            req.flash('success','포스트 생성 성공');
            res.redirect("back");
        }
    })

});


router.get('/',checkAuthenticated, (req, res) => {
    Post.find()
        .populate('comments')
        .sort({createdAt: -1})
        .exec((err, posts) => {
            if(err){
                console.log(err)
            }else{
                res.render('posts',{
                    posts: posts
                })
            }
        })
    
})

router.get('/:id/edit', checkPostOwnerShip, (req, res) => {
    res.render('posts/edit', {
        post: req.post
    })
})

router.put('/:id', checkPostOwnerShip, (req,res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        if(err){
            req.flash('error', '수정에 실패했습니다.');
            res.redirect('/posts')
        }else{
            req.flash('success', '수정에 성공했습니다');
            res.redirect('/posts');
        }
    })
})

router.delete('/:id', checkPostOwnerShip, (req, res) => {
    Post.findByIdAndDelete(req.params.id, (err, post) => {
        if(err) {
            req.flash('error','삭제 실패');
        }else{
            req.flash('success', '삭제 성공');
        }
        res.redirect('/posts');
    })
})

module.exports = router;