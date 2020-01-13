import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const initialState =  { bySlug: {}, allSlugs:[] };

const user = handleActions(
  {
    [actions.userReg](state, { payload: { reg } }) {
      return { ...state, isSuccessful: reg, error: null };
    },
    [actions.userRegErr](state, { payload: { error } }) {
      return { ...state, isSuccessful: null, error };
    },
    [actions.userLogin](state, { payload: { userData } }) {
      return { ...state, userData: { ...userData }, isAuthorized: true };
    },
    [actions.userLoginErr](state) {
      return { ...state, error: true };
    },
    [actions.userExit](state) {
      return {
        ...state,
        isSuccessful: null,
        isAuthorized: null,
        error: null,
        userData: {
          id: '',
          email: '',
          username: '',
          token: '',
        },
      };
    },
  },
  {
    isSuccessful: null,
    isAuthorized: null,
    error: null,
    userData: {
      id: '',
      email: '',
      username: '',
      token: '',
    },
  }
);

const articles = handleActions({
  [actions.getAllArticles](state, { payload: { article } }) {
    state = initialState;
    const { articles } = article;
    return articles.reduce((acc, post) => {
       return { 
               bySlug: {
                  ...acc.bySlug,
                  [post.slug]: post,
               },
               allSlugs: [ ...acc.allSlugs, post.slug],
              };
    }, state);
  },
  [actions.favoriteArticlesAdd](state, { payload: { favoritsArticles } }) {
    //const { articles } = favoritsArticles;
    return {
      ...state,
    };
    
  },
  [actions.articleAdd](state) {
        return {
          ...state
        };
  },
  [actions.articleEdit](state, { payload: { article, slug } }) {
    const newBySlug =  Object.keys(state.bySlug)
                             .filter((id) => id !== slug)
                             .reduce((acc, currentKey) => {
                                  return {
                                    ...acc,
                                    [currentKey]: state.bySlug[currentKey],
                                  }
                             }, {});

    const newAllSlugs = [ ...state.allSlugs.filter((id) => id !== slug), article.slug ];
    return {
      ...state,
      bySlug: {
        [article.slug]: article,
        ...newBySlug,
      },
      allSlugs: newAllSlugs,
    };
  },
  [actions.favoriteArticle](state, { payload: { article } }) {
    const { favorited, favoritesCount } = article;

    return {
      ...state,
      bySlug:{
        ...state.bySlug,
        [article.slug]: {
          ...article,
          favorited: favorited,
          favoritesCount: favoritesCount,
        },
      },
    };
  },
  [actions.unfavoriteArticle](state, { payload: { article } }) {
    const { favorited, favoritesCount } = article;

    return {
      ...state,
      bySlug:{
        ...state.bySlug,
        [article.slug]: {
          ...article,
          favorited: favorited,
          favoritesCount: favoritesCount,
        },
      },
    };
  },
  [actions.userExit](state) {
    const newSlag = Object.fromEntries(
      Object.entries(state.bySlug).map(([key, value]) => {
                const newValue = { ...value, favorited: false };
                return [key, newValue];
      })
    );

    return {
      ...state,
      bySlug: newSlag,
    };
  }
}, initialState);

const articlesUiState = handleActions({
  [actions.articleAdd](state) {
    return {
      ...state,
      isSuccessful: true,
    }
  },
  [actions.articleAddErr](state) {
    return {
      ...state,
      isSuccessful: false,
    }
  },
  [actions.articleEdit](state) {
    return {
      ...state,
      isEditSuccessful: true,
    }
  },
  [actions.articleEditErr](state) {
      return {
        ...state,
        isEditSuccessful: false,
      }
  },
  [actions.userExit](state) {
    return {
      ...state,
      isSuccessful: null,
      isEditSuccessful: null,
    };
  },
  [actions.getAllArticles](state, { payload: { article } }) {
    const { articlesCount } = article;
    return {
      ...state,
      isSuccessful: null,
      isEditSuccessful: null,
      totalPostCount: articlesCount,
    };
  },
  [actions.pageChange](state, { payload: { pageNumber } }) {
    return {
      ...state,
      currentPage: pageNumber,
    };
  },
}, { isSuccessful: null, totalPostCount: null, pageSize: 10, currentPage: 1, isEditSuccessful: null });

const rootReducer = combineReducers({ user, articles, articlesUiState });

export default rootReducer;
