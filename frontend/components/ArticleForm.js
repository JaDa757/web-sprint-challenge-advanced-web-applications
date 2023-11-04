import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle,
}) {
  const [values, setValues] = useState(initialFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentArticle) {
      setValues(currentArticle);
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);

    if (currentArticle) {
      await updateArticle({ article_id: currentArticle.article_id, article: values });
    } else {
      await postArticle(values);
    }
    setIsSubmitting(false);
    setValues(initialFormValues);
    setCurrentArticleId(null);
  }

  const isDisabled = () => {
    return !values.title || !values.text || !values.topic;
  };

  const formTitle = currentArticle ? 'Edit Article' : 'Create Article';

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{formTitle}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button
          disabled={isDisabled() || isSubmitting}
          id="submitArticle"
        >
          Submit
        </button>
        {currentArticle && (
          <button
            onClick={() => setCurrentArticleId(null)}
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
