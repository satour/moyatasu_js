import React from 'react'
import { db } from '../../../js/firebase';

import Article from './Article/Article'


const getFeed = (e, user) => {

  const dbCollectionArticles = db.collection("messages");
  const dbCollectionComments = db.collection("comments");
  
  let articles = dbCollectionArticles.orderBy('created');

  articles.onSnapshot((docSnapShot) => {

    let comments = dbCollectionComments.orderBy('created');

    comments.get()
      .then(querySnapshot => {
        const dataCommentsHash = this._generateCommentsHash(querySnapshot);
        return dataCommentsHash
      })
      .then(dataCommentsHash => {
        const articles = this._buildArticles(docSnapShot, dataCommentsHash)
        this.setState({ articles, loaded: true, me: user });
      });
  })
}

const Feed = ({
  articles,
  deleteArticle,
  addComment,
  deleteComment,
  handleChange,
  state,
  stateMeUid
}) => {

  const articlesLength = articles.length;

  return (
    articles.reverse().map((article, index) => {
      return (
        <Article
          key={article.id}
          article={article}
          articlesLength={articlesLength}
          index={index}
          deleteArticle={deleteArticle}
          addComment={addComment}
          deleteComment={deleteComment}
          handleChange={handleChange}
          stateMeUid={stateMeUid}
          stateComment={state[`comment-${article.id}`]}
        />
      )
    })
  )
}

export default Feed
