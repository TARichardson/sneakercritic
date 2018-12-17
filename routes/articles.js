const express             = require('express');
const { CommentsRouter }  = require('./comments');
const { BrandsRouter }    = require('./brands');
const { SneakersRouter }  = require('./sneakers')
const { Article, Sneaker, Comment }         = require('../models');

const ArticlesRouter = express.Router();
ArticlesRouter.use('/comments', CommentsRouter);
ArticlesRouter.use('/brands', BrandsRouter);

ArticlesRouter.get('/',
  async (req, res) => {
    //const articles = a
    try {
      const articles = await Article.findAll( {
        include: [Sneaker, Comment],
        require: true,
      });
      res.json({articles});
    }
    catch(evt) {
      res.status(500).json({msg: evt.messsage})
    }
  }
);

ArticlesRouter.post('/',
  async (req, res) => {
    try {
      const articles = await Article.create(req.body);
      res.json({articles});
    }
    catch(evt) {
      res.status(500).json({msg: evt.messsage})
    }
  }
);

ArticlesRouter.get('/:article_id',
  async (req, res) => {
    try {
      const articles = await Article.findByPk(req.params.article_id, {
        include: [Sneaker, Comment],
        require: true,
      });
      res.json({articles})
    }
    catch(evt) {
      res.status(500).json({msg: evt.messsage})
    }
  }
);

ArticlesRouter.put('/:article_id',
  async (req, res) => {
  // res.json({msg: `update article by id ${req.params.article_id}`});
    try {
      const data = req.body;
      const article = await Article.findByPk(req.params.article_id);
      const resp = await Article.update(
        {
          title: data.title || article.title,
        },
        {
          where: {
            id: req.params.article_id,
          }
        }
      );
      console.log(data)
      res.json(data);
    }
    catch(evt) {
      res.status(500).json({msg: evt.message})
    }
  }
);

ArticlesRouter.delete('/:article_id',
  async (req, res) => {
    try {
      await Article.destroy(
        {
          where: {
            id: req.params.article_id,
          }
        },
        {
          truncate: true
        }
      );
      res.json({msg: `delete article by id ${req.params.article_id}`});
    }
    catch(evt) {
      res.status(500).json({msg: evt.message})
    }
  }
);

module.exports = {
  ArticlesRouter,
}
