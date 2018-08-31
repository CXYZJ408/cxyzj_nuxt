module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '程序员之家',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.png'},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'},
      {rel: 'stylesheet', href: 'http://at.alicdn.com/t/font_795495_el51iwa9izu.css'}
    ]
  },
  plugins: [
    {src: '~/plugins/vuetify.js'},
    {src: '~/plugins/particles.js', ssr: false},
    {src: '~/assets/js/iconfont.js', ssr: false},
    {src: '~/plugins/element.js'},
    {src: '~/plugins/menu.js'},
    {src: '~/plugins/component.js'}],
  css: [
    '~/assets/style/app.styl',
    '~/assets/style/common.css',
    '~/assets/style/iconfont.css',
    'element-ui/lib/theme-chalk/index.css'],
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vuetify.js'
    ],
    extractCSS: true
    /*
    ** Run ESLint on save
    */
  }
}
