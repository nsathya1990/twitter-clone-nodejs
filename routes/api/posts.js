const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res, next) => {
    const results = await getPosts({});
    res.status(200).send(results);
});

router.get('/:id', async (req, res, next) => {
    const postId = req.params.id;

    let results = await getPosts({ _id: postId });
    results = results[0];

    res.status(200).send(results);
});

router.post('/', async (req, res, next) => {
    if (!req.body.content) {
        console.log('Content param not sent with request');
        return res.sendStatus(400);
    }

    const postData = {
        content: req.body.content,
        postedBy: req.session.user,
    };

    if (req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }

    Post.create(postData)
        .then(async (newPost) => {
            newPost = await User.populate(newPost, { path: 'postedBy' });

            res.status(201).send(newPost);
        })
        .catch((error) => {
            console.log('---ERROR---');
            console.error(error);
            res.sendStatus(400);
        });
});

router.put('/:id/like', async (req, res, next) => {
    console.log(req.params.id);
    const postId = req.params.id;
    const userId = req.session.user._id;

    const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    const option = isLiked ? '$pull' : '$addToSet';

    /** insert/ remove user like */
    req.session.user = await User.findByIdAndUpdate(
        userId,
        { [option]: { likes: postId } },
        { new: true }
    ).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });

    /** insert post like */
    const post = await Post.findByIdAndUpdate(
        postId,
        { [option]: { likes: userId } },
        { new: true }
    ).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });

    res.status(200).send(post);
});

router.post('/:id/retweet', async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.session.user._id;

    /**try and delete retweet */
    const deletedPost = await Post.findOneAndDelete({
        postedBy: userId,
        retweetData: postId,
    }).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });

    const option = deletedPost ? '$pull' : '$addToSet';

    let repost = deletedPost;

    if (!repost) {
        repost = await Post.create({ postedBy: userId, retweetData: postId }).catch((error) => {
            console.log(error);
            req.sendStatus(400);
        });
    }

    /** insert/ remove user retweet */
    req.session.user = await User.findByIdAndUpdate(
        userId,
        { [option]: { retweets: repost._id } },
        { new: true }
    ).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });

    /** insert post like */
    const post = await Post.findByIdAndUpdate(
        postId,
        { [option]: { retweetUsers: userId } },
        { new: true }
    ).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });

    res.status(200).send(post);
});

async function getPosts(filter) {
    const results = await Post.find(filter)
        .populate('postedBy')
        .populate('retweetData')
        .sort({ createdAt: -1 })
        .catch((error) => console.log(error));

    return await User.populate(results, { path: 'retweetData.postedBy' });
}

module.exports = router;
