const { sequelize, Article, Comment, User, Sneaker, Brand, CArticle, CComment,
  CUser, CSneaker, CBrand } = require('./models');

async function seed() {
  try {
    // seed stuff :)
  }
  catch(evt) {
    console.error(evt);
  }
  finally {
    process.exit();
  }
};

seed();
