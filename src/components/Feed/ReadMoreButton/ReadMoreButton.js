const ReadMoreButton = ({
  readMoreArticles,
  handleChange,
  stateArticle
}) => {
  return (
      <div className="moya__form__submit">
        <button type="submit" id="ReadMoreButton" onClick={readMoreArticles}>もっと読む...</button>
      </div>
  )
}

export default ReadMoreButton