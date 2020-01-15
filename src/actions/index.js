import { createAction } from 'redux-actions';

  export const userReg = createAction('USER_REG');
  export const userRegErr = createAction('USER_REG_ERROR');
  export const userLogin = createAction('USER_LOGIN');
  export const userLoginErr = createAction('USER_LOGIN_ERROR');
  export const userExit = createAction('USER_LOGIN_EXIT');
  export const articleAdd = createAction('ARCTICLE_ADD');
  export const articleAddErr = createAction('ARTICLE_ADD_ERROR');
  export const getAllArticles = createAction('GET_ALL_ARTICLES');
  export const likeOrDisLikeArticle = createAction('FAVORITE_UNFAVORITE_ARTICLE');
  export const pageChange = createAction("PAGE_CHANGE");
  export const articleEdit = createAction('ARTICLE_EDIT');
  export const articleEditErr = createAction('ARTCILE_EDIT_ERR');

 const API_BASE = 'https://conduit.productionready.io/api';
 const getHeaders = (token = null) => {

  if (!token) {
    return {
      'Content-Type': 'application/json;charset=utf-8',
    };
  }

   return {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': `Token ${token}`,
   };
 }
  export const registration = (data, resetForm) => async dispatch => {
    const response = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: getHeaders(),
      body: data,
    });

    if (response.ok) {
      resetForm();
      return dispatch(userReg({ reg: true }));
  }

  const error = await response.json().then(err => {
    return err.errors;
  });

  return dispatch(userRegErr({ error }));
};

export const login = (data) => async dispatch => {

  const { user: localUser } = data; 

  const response = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (response.ok) {
      const { user }  = await response.json().then(userData => {
      return userData;
    });
    dispatch(userLogin({ userData: { ...user } }));
    localStorage.setItem('user', JSON.stringify(localUser));
    return true;
  }

  return dispatch(userLoginErr());
};

export const exit = () => {
  localStorage.clear();
  return userExit();
};


export const handleArticleAdd = (data, token, resetForm) => async (dispatch) => {
  const response = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const { article } = await response.json();
    dispatch(articleAdd({ article }));
    resetForm();
    return article.slug;
  } else {
    resetForm();
    dispatch(articleAddErr());
  }
}

export const handleArticleEdit = (data, token, slug) => async (dispatch) => {
    const response = await fetch(`${API_BASE}/articles/${slug}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { article } = await response.json();
      dispatch(articleEdit({ article, slug }));
      return Promise.resolve(true);
    } else {
      dispatch(articleEditErr());
      return  Promise.reject(false);
    }
}

export const handleGetAllArticles = (pageSize, currentPage, token = null) => async (dispatch) => {

  const pageIndex = currentPage === 1 ? 0 : currentPage - 1;
  const offset = pageIndex === 0 ? 0 : (pageIndex * 10);
  const url = `${API_BASE}/articles?limit=${pageSize}&offset=${offset}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(token),
  });

  if (response.ok) {
    const article = await response.json();
    dispatch(getAllArticles({ article }));
  }
}

export const handleLike = (slug, token, toggleLike) => async (dispatch) => {
  
   if (!token) {
     return;
   }

   const method = toggleLike === false ?  'POST' : 'DELETE';

     const response = await fetch(`${API_BASE}/articles/${slug}/favorite`, {
       method: method,
       headers: getHeaders(token),
     });

     if (response.ok) {
      const { article } = await response.json();
      dispatch(likeOrDisLikeArticle({ article }));
      return;
     }
}
