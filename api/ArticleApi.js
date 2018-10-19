import $axios from '../utils/axios'

let Article = '/v1/article'
export default class ArticleApi {
  constructor (store) {
    $axios.setStore(store)
  }

  async getArticle (articleId) {
    let url = Article + `/${articleId}`
    return new Promise(resolve => {
      resolve($axios.get(url))
    })
  }

  async getArticleList (params) {
    let url = Article
    return new Promise(resolve => {
      resolve($axios.get(url, params))
    })
  }

  async writeArticle (params) {
    let url = Article + '/write'
    return new Promise(resolve => {
      resolve($axios.post(url, params))
    })
  }
}
