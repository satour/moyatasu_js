import React from 'react';
import {db, auth, provider, fieldValue} from './firebase';
import Header from '../components/Header';
import ArticleForm from '../components/Article/ArticleForm';
import ArticleList from '../components/Article/ArticleList';

const dbCollectionArticles = db.collection("messages");
const dbCollectionComments = db.collection("comments");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      me: null
    }
  }

  // Article Methods
  addArticle = (e) => {
    e.preventDefault();

    const article = this.state.article
    if (!article) { return; }

    this._clearState('article');
    this._focusSubmit();

    const ref = dbCollectionArticles.doc();
    ref.set({
      message: article,
      created: fieldValue.serverTimestamp(),
      updated: fieldValue.serverTimestamp(),
      uid: this.state.me ? this.state.me.uid : 'nobody',
      displayName: this.state.me ? this.state.me.displayName : 'noname'
    }).then(function(docRef) {
      console.log(docRef);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  deleteArticle = (e) => {
    if(window.confirm('本当に削除しますか？')){
      dbCollectionArticles.doc(e.target.value).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removeing document: ", error);
      });
    }
  }

  // Comment Methods
  addComment = (e) => {
    e.preventDefault();

    const articleId = e.target.dataset.articleId;
    const key = `comment-${articleId}`

    const comment = this.state[key];
    if (!comment) { return; }

    this._clearState(key);

    const article = dbCollectionArticles.doc(articleId);
    const ref = dbCollectionComments.doc();
    ref.set({
      articleId: articleId,
      message: comment,
      created: fieldValue.serverTimestamp(),
      uid: this.state.me ? this.state.me.uid : 'nobody',
      displayName: this.state.me ? this.state.me.displayName : 'noname'
    }).then(function(docRef) {
      article.update({
        updated: fieldValue.serverTimestamp()
      }).then(function(docRef) {
        console.log(docRef);
      }).catch(function(error) {
        console.error("Error update document: ", error);
      });
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  deleteComment = (e) => {
    if(window.confirm('本当に削除しますか？')){
      const commentId = e.target.value;
      const articleId = e.target.dataset.articleId;
      const article = dbCollectionArticles.doc(articleId);
      const comment = dbCollectionComments.doc(commentId);

      comment.delete().then(function() {
        article.update({
          deletedCommentAt: fieldValue.serverTimestamp()
        }).then(function(docRef) {
          console.log(docRef);
        }).catch(function(error) {
          console.error("Error update document: ", error);
        });
      }).catch(function(error) {
        console.error("Error removeing comment: ", error);
      });
    }
  }

  // Auth Methods
  login = (e) => {
    auth.signInWithPopup(provider);
  }

  logout = (e) => {
    auth.signOut();
  }

  // State Methods
  handleChange = (e) => {
    const t = e.target;
    this.state[t.name] = t.value;
  }

  // Component Methods
  componentWillMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        dbCollectionArticles.orderBy('created').onSnapshot((docSnapShot) => {
          dbCollectionComments.orderBy('created').get().then(querySnapshot => {
            const dataCommentsHash = this._generateCommentsHash(querySnapshot);
            return dataCommentsHash
          }).then(commentsHash => {
            const articles = this._buildArticles(docSnapShot, commentsHash)

            this.setState({
              articles,
              loaded: true,
              me: user
            });
          });
        })
      } else {
        this.setState({
          me: null
        })
      }
    });
  }

  // Private Methods
    // common
    _clearState(key) {
      this.setState({[key]: ''}, () => {
        this.setState({[key]: undefined});
      });
    }

    // addArticle
    _focusSubmit() {
      document.getElementById('submit').focus();
    }

    // componentWillMount ()
    _generateCommentsHash(querySnapshot) {
      let comments = {};

      const commentsArray = this._generateCommentsArray(querySnapshot)
      commentsArray.forEach(dataComment => {
        const articleId = dataComment.articleId;
        if(!comments[articleId]){ comments[articleId] = []; }
        comments[articleId].push(dataComment);
      });

      return comments;
    }

    _generateCommentsArray(querySnapshot) {
      let dataComments = [];

      querySnapshot.forEach(comment_doc => {
        let comment_data = comment_doc.data();
        comment_data.id = comment_doc.id;
        dataComments.push(comment_data);
      });

      return dataComments;
    }

    _buildArticles(docSnapShot, commentsHash) {
      let articles = [];

      docSnapShot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        data.comments = commentsHash[doc.id] || [];
        articles.push(data);
      });

      return articles;
    }

    // render ()
    _renderContent() {
      return (
        <section className="moya__container">
          <ArticleForm
            addArticle={this.addArticle}
            handleChange={this.handleChange}
            stateArticle={this.state.article}
          />
          <ArticleList
            articles={this.state.articles.slice()}
            deleteArticle={this.deleteArticle}
            addComment={this.addComment}
            deleteComment={this.deleteComment}
            handleChange={this.handleChange}
            state={this.state}
            stateMeUid={this.state.me.uid}
          />
        </section>
      )
    }

  // Render Method
  render() {
    return (
      <div className="App">
        <Header login={this.login} logout={this.logout} stateMe={this.state.me}/>
        {this.state.me && this._renderContent()}
      </div>
    )
  }
}

export default App;
