import React from 'react'
import Article from './Article/Article'
import Feed from '../Feed/Feed'

const readMoreArticles = () => {

}

const ReadMoreButton = ({
  readMoreArticles
}) => {
  return (
      <div className="moya__form__submit">
        <button type="submit" id="ReadMoreButton" onClick={readMoreArticles}>もっと読む...</button>
      </div>
  )
}

export default ReadMoreButton