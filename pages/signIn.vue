<template>
    <v-flex md5 sm8 xs12 lg4 xl3>
        <v-card class="pa-3 ma-2 elevation-10 form">
            <v-card-text class="display-2">登录·
                <nuxt-link class="grey--text" to="/signUp">注册</nuxt-link>
            </v-card-text>
            <v-form v-if="loginWithPassword" v-model="valid" ref="form" lazy-validation>
                <v-text-field
                        class="pt-2 px-3"
                        prepend-icon="account_circle"
                        v-model="phoneEmail"
                        :rules="phoneEmailRules"
                        label="手机号或邮箱"
                        required
                        @keyup.enter="login"
                ></v-text-field>
                <v-text-field
                        class="pt-3 px-3"
                        :type="show?'text':'password'"
                        :append-icon="show?'visibility_off':'visibility'"
                        prepend-icon="lock"
                        v-model="password"
                        :rules="passwordRules"
                        label="密码"
                        @click:append="show=!show"
                        required
                        @keyup.enter="login"
                ></v-text-field>

            </v-form>
            <v-form v-else v-model="valid2" ref="form2" lazy-validation>
                <v-text-field
                        class="pt-2 px-3"
                        prepend-icon="account_circle"
                        v-model="phoneEmail"
                        :rules="phoneRules"
                        label="手机号"
                        required
                        @keyup.enter="login"
                ></v-text-field>
                <v-layout class="pt-2 ">
                    <v-flex md7>
                        <v-text-field
                                class="px-3"
                                prepend-icon="verified_user"
                                v-model="code"
                                :rules="codeRules"
                                label="短信验证码"
                                required
                                @keyup.enter="login"
                        ></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-btn large round color="grey " class="white--text" @click="sendCode" :disabled="disabled">
                            {{codeMsg}}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-form>
            <v-layout>
                <v-flex md6 sm6 class="text-md-left text-sm-left text-xs-left">
                    <v-btn flat round class="blue--text" @click="change">{{text}}</v-btn>
                </v-flex>
                <v-flex md4 offset-md2 sm5 offset-sm4 class="text-md-right text-sm-right text-xs-right">
                    <v-btn flat round to="/forget"
                           class="blue-grey--text">忘记密码？
                    </v-btn>
                </v-flex>
            </v-layout>
            <v-layout justify-center>
                <v-flex md8 class="py-3">
                    <v-btn block outline flat round large class="display-1 white--text" color="light-blue "
                           @click="login">登录
                    </v-btn>
                </v-flex>
            </v-layout>
            <v-card-text class="pt-2">第三方登录</v-card-text>
            <v-layout align-center justify-center>
                <v-flex md2>
                    <v-btn icon flat color="blue">
                        <v-icon color="blue">iconfont icon-QQ</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex md2>
                    <v-btn icon flat color="red">
                        <v-icon color="red">iconfont icon-weibo</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex md2>
                    <v-btn icon flat color="black">
                        <v-icon>iconfont icon-github</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card>
    </v-flex>
</template>
<script>
  import { UserApi } from '../api/UserApi'
  //todo 添加图片验证码
  let $cookie
  let $userApi
  export default {
	head: {
	  title: '程序员之家 - 登录'
	},
	layout: 'signIn',
	computed: {
	  disabled: function () {
		if ( typeof ( this.phoneEmail ) === 'undefined' || this.hasSend ) {
		  return true
		}
		const phone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
		return !( this.phoneEmail.length !== 0 && phone.test(this.phoneEmail) )
	  }
	},
	data: function () {
	  return {
		code: '',
		reset: false,
		codeRules: [
		  v => !!v || '验证码不可为空'
		],
		codeMsg: '发送验证码',
		hasSend: false,
		valid: false,
		valid2: false,
		text: '手机验证码登录',
		loginWithPassword: true,
		phoneEmail: '',
		show: false,
		phoneEmailRules: [
		  v => !!v || '手机号或邮箱不可为空',
		  v => {
			const phone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
			const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return phone.test(v) || email.test(v) || '请输入正确的手机号或邮箱'
		  }
		],
		phoneRules: [
		  v => !!v || '手机号不可为空',
		  v => {
			const phone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
			return phone.test(v) || '请输入正确的手机号'
		  }
		],
		password: '',
		passwordRules:
		  [ v => !!v || '密码不可为空' ]
	  }
	},
	methods: {
	  change: function () {
		this.loginWithPassword = !this.loginWithPassword
		if ( this.loginWithPassword ) {
		  this.text = '手机验证码登录'
		  this.$refs.form2.reset()
		} else {
		  this.text = '密码登录(手机号或邮箱)'
		  this.$refs.form.reset()
		}
	  },
	  isPhone (phoneEmail) {
		const phone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
		return phone.test(phoneEmail)
	  },
	  sendCode () {
		//获取验证码
		$userApi.sendCodeUsePhone(this.phoneEmail).then((res) => {
		  if ( res.status === this.$status.SUCCESS ) {
			//成功发送验证码
			this.$message.success('验证码发送成功')
			let times = 60
			this.codeMsg = '重新获取(60秒)'
			this.hasSend = true
			let timer = setInterval(() => {
			  if ( times === 0 || this.text === '手机验证码登录' ) {
				clearInterval(timer)
				this.hasSend = false
				this.codeMsg = '发送验证码'
			  } else {
				times--
				this.codeMsg = `重新获取(${times}秒)`
			  }
			}, 1000)
		  } else if ( res.status === this.$status.CODE_SEND_FAILURE ) {
			this.$message.error('验证码发送失败，请尝试重新发送')
		  }
		}).catch(e => {
		  this.$message.error('验证码发送失败，请尝试重新发送')
		})
	  },
	  login () {
		if ( this.loginWithPassword && this.$refs.form.validate() ) {
		  //使用密码登录
		  let $md5 = require('js-md5')
		  let password = $md5(this.password.split('').reverse().join(''))//将密码逆序同时进行md5处理
		  if ( this.isPhone(this.phoneEmail) ) {
			//手机+密码登录
			$userApi.loginPasswordUsePhone(this.phoneEmail, password).then((res) => {
			  this.handleLoginResult(res)
			})
		  } else {
			//邮箱+密码登录
			$userApi.loginPasswordUseEmail(this.phoneEmail, password).then((res) => {
			  this.handleLoginResult(res)
			})
		  }
		} else if ( !this.loginWithPassword && this.$refs.form2.validate() ) {
		  //使用手机+验证码登录
		  $userApi.loginCode(this.phoneEmail, this.code).then((res) => {
			this.handleLoginResult(res)
		  })
		}
	  },
	  handleLoginResult (res) {
		let status = res.status
		if ( status === this.$status.WRONG_PASSWORD ) {
		  this.$message.error('密码错误！！')
		} else if ( status === this.$status.NONE_USER ) {
		  this.$message.error('当前用户不存在，请先注册！！')
		} else if ( status === this.$status.CODE_ERROR ) {
		  this.$message.error('验证码错误！！')
		} else if ( status === this.$status.SUCCESS ) {
		  this.$store.commit('login', res.data)
		  $cookie.set('token', res.data.token, { expires: 7 })
		  this.$router.push({ path: `/` })
		}
	  }
	},
	mounted () {
	  //初始化
	  $cookie = require('js-cookie')
	  $userApi = new UserApi(this.$store)
	}
  }
</script>
<style scoped>
    a {
        text-decoration: none;
    }

    .icon {
        height: 30px;
    }

</style>
