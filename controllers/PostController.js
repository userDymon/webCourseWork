import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
      const posts = await PostModel.find().limit(5).exec();
  
      const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);
  
      res.json(tags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить тэги',
      });
    }
  };

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Cannot find posts',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            }
        ).populate('user');

        if (!updatedPost) {
            return res.status(404).json({
                message: 'Cannot find a post',
            });
        }

        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot find a post',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({
                message: 'Cannot find a post',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot remove a post',
        });
    }
};

export const create = async (req, res) => {
    try {
        const tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',');

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
};



export const update = async (req, res) => {
    try{
        const postId = req.params.id;

        const tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',');

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: tags,
                user: req.userId,
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot update a post',
        });
    }
};
