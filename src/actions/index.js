import { createAction } from 'redux-actions';

  export const userReg = createAction('USER_REG');
  export const userRegErr = createAction('USER_REG_ERROR');
  export const userLogin = createAction('USER_LOGIN');
  export const userLoginErr = createAction('USER_LOGIN_ERROR');
  export const userExit = createAction('USER_LOGIN_EXIT');
  export const articleAdd = createAction('ARCTICLE_ADD');
  export const favoriteArticlesAdd = createAction('FAVORITE_ARTICLE_ADD');
  export const articleAddErr = createAction('ARTICLE_ADD_ERROR');
  export const getAllArticles = createAction('GET_ALL_ARTICLES');
  export const favoriteArticle = createAction('FAVORITE_ARTICLE'); 
  export const unfavoriteArticle = createAction('UNFAVORITE_ARTICLE'); 
  export const pageChange = createAction("PAGE_CHANGE");
  export const articleEdit = createAction('ARTICLE_EDIT');
  export const articleEditErr = createAction('ARTCILE_EDIT_ERR');

  export const registration = (data, resetForm) => async dispatch => {
    const response = await fetch(`https://conduit.productionready.io/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const login = (data, resetForm) => async dispatch => {
  const response = await fetch(`https://conduit.productionready.io/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: data,
  });

  if (response.ok) {
    const { user }  = await response.json().then(userData => {
      return userData;
    });
    resetForm();
    dispatch(userLogin({ userData: { ...user } }));
    return;
  }

  return dispatch(userLoginErr());
};

export const exit = () => {
  return userExit();
};


export const handleArticleAdd = (data, token, resetForm) => async (dispatch) => {
  const response = await fetch(`https://conduit.productionready.io/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': `Token ${token}`,
    },
    body: data,
  });

  if (response.ok) {
    const { article } = await response.json();
    dispatch(articleAdd({ article }));
    resetForm();
  } else {
    resetForm();
    dispatch(articleAddErr());
  }
}

export const handleArticleEdit = (data, token, resetForm, slug) => async (dispatch) => {
    console.log(data);
    const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Token ${token}`,
      },
      body: data,
    });

    if (response.ok) {
      const { article } = await response.json();
      dispatch(articleEdit({ article, slug }));
      resetForm();
    } else {
      return dispatch(articleEditErr());
    }
}

export const handleGetAllArticles = (pageSize, currentPage, username) => async (dispatch) => {

  const pageIndex = currentPage === 1 ? 0 : currentPage - 1;
  const offset = pageIndex === 0 ? 0 : (pageIndex * 10);
  const url = `https://conduit.productionready.io/api/articles?limit=${pageSize}&offset=${offset}`;

  const response = await fetch(url);

  if (response.ok) {
    const article = await response.json();
    dispatch(getAllArticles({ article }));
    if (username !== '') {
      const response = await fetch(`https://conduit.productionready.io/api/articles?&favorited=${username}&limit=100&offset=${offset}`);
      const favoritsArticles = await response.json();
      dispatch(favoriteArticlesAdd({ favoritsArticles }));
    }
    return;
  }

}

export const handleLike = (slug, token, toggleLike) => async (dispatch) => {
  
   if (!token) {
     return;
   }

   if (!toggleLike) {
     const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/favorite`, {
       method: 'POST',
       headers: {
        'Authorization': `Token ${token}`,
       }
     });

     if (response.ok) {
      const { article } = await response.json();
      dispatch(favoriteArticle({ article }));
      console.log(article, 'like');      
      return;
     }
    
   } else {
     const response = await fetch(`https://conduit.productionready.io/api/articles/${slug}/favorite`, {
       method: 'DELETE',
       headers: {
        'Authorization': `Token ${token}`,
       },
     });

     if (response.ok) {
        const { article } = await response.json();
        dispatch(unfavoriteArticle({ article }));
        console.log(article, 'unfavorite like');
        return;
     }
   }
}
