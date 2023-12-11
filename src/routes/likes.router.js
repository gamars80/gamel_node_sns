const express = require('express');
const { route } = require('./main.router');
const { checkAuthenticated } = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/posts.model');

router.put('/posts/:id/like', checkAuthenticated, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if(err || !post) {
            req.flash('error', '포스트를 찾지 못했거나 에러 발생');
            res.redirect('back');
        }else{
            //이미 누른 좋아요일 경우
            if(post.likes.find(like =>  like === req.user._id.toString())) {
                const updatedLikes = post.likes.filter(like => like !== req.user._id.toString());
                Post.findByIdAndUpdate(post._id, {
                    likes: updatedLikes
                },
                //{new: true}, 
                (err, post) => { //{new: true} 는 반환되는 post가 업데이트 된 post를 가져오기 위하여 설정하는 옵션
                    if(err) {
                        req.flash('error', '좋아요 업데이트 실패');
                        res.redirect('back');
                    }else{
                        req.flash('success', '좋아요 업데이트 성공');
                        res.redirect('back');
                    }
                })
            }else{
                //아직 좋아요 안했을 경우
                Post.findByIdAndUpdate(post._id, {
                    likes: post.likes.concat([req.user._id])
                }, (err, _) => {
                    if(err) {
                        req.flash('error', '좋아요 실패');
                        res.redirect('back');
                    }else{
                        req.flash('success', '좋아요 업데이트 성공');
                        res.redirect('back');
                    }
                } )
            }
        }
    })
})

module.exports = router;