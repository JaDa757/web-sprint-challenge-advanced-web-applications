import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

import PrivateRoute from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }


  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  }


  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl, { username, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setMessage(response.data.message);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch((error) => {
        console.log("error:", error)
        setMessage('Login failed');
        setSpinnerOn(false);
      });
  }


  const getArticles = async () => {
    try {
      setMessage('');
      setSpinnerOn(true);

      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setArticles(response.data.articles);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSpinnerOn(false);
    }
  }


  const postArticle = async (article) => {
    setMessage('')
    setSpinnerOn(true);

    const token = localStorage.getItem('token');
    if (!token) {
      redirectToLogin();
      return;
    }
    if (!article.title || !article.text || !article.topic) {
      setMessage('Invalid article data');
      setSpinnerOn(false);
      return;
    }
    const payload = {
      title: article.title.trim(),
      text: article.text.trim(),
      topic: article.topic,
    };
    axios
      .post(articlesUrl, payload, {
        headers: {
          Authorization: token
        },
      })
      .then((response) => {
        if (response.status === 201) {
          const newArticle = response.data.article;
          setMessage(response.data.message);
          setArticles([...articles, newArticle]);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage('Failed to create the article');
      })
      .finally(() => {
        setSpinnerOn(false);
      })
  }


  const updateArticle = ({ article_id, article }) => {
    if (currentArticleId === article_id) {
      setMessage('');
      setSpinnerOn(true);
      const token = localStorage.getItem('token');
      if (!token) {
        redirectToLogin();
        return;
      }
      if (!article.title || !article.text || !article.topic) {
        setMessage('Invalid article data');
        setSpinnerOn(false);
        return;
      }
      const updatedArticle = {
        title: article.title.trim(),
        text: article.text.trim(),
        topic: article.topic,
      };
      axios
        .put(`${articlesUrl}/${article_id}`, updatedArticle, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.status === 200) {

            const updatedArticle = response.data.article;

            setArticles((articles) => {
              return articles.map((item) =>
                item.article_id === article_id ? updatedArticle : item
              );
            });

            setMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.log("Error updating article:", error);
          setMessage('Failed to update the article');
        })
        .finally(() => {
          setSpinnerOn(false);
        });
    }
  };


  const deleteArticle = (article_id) => {
    setSpinnerOn(true);
    const token = localStorage.getItem('token');
    axios
      .delete(`${articlesUrl}/${article_id}`, {
        headers: {
          Authorization: token
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setArticles(articles.filter(item => item.article_id !== article_id));
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.log("Error deleting article:", error);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

console.log(articles)
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>

          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} loginUrl={loginUrl} />} />
          <Route path="articles" element={
            <PrivateRoute>
              <ArticleForm
                articlesUrl={articlesUrl}
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find((article) => article.article_id === currentArticleId)}
              />
              <Articles
                getArticles={getArticles}
                articles={articles}
                deleteArticle={deleteArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </PrivateRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
