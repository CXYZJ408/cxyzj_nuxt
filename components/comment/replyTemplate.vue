<template>
    <v-layout @mouseenter="show=true" @mouseleave="show=false" row wrap class="mx-2">
        <v-flex md12>
            <v-layout row wrap>
                <v-flex md12>
                    <nuxt-link :to="'/user/'+user.user_id+'/articles'">
                        <span class="capital font-2">{{user.nickname}}</span>
                    </nuxt-link>
                    <span class="grey--text  ml-3 font-1">
                    {{createTime}}
                    </span>
                </v-flex>
                <v-flex md12 class="py-2">
                    <p class="clearMargin font-2">
                        <nuxt-link :to="'/user/'+reply.discusser_id+'/articles'" class=" ml-1 capital">
                            @{{reply.discusser_nickname}}：</nuxt-link>{{reply.text}}
                    </p>
                </v-flex>
                <v-flex md4>
                    <v-hover class="grey--text">
                        <a slot-scope="{ hover }" @click="support">
                            <v-icon size="22" :class="{'red--text text--darken-2':hover||reply.is_support}">
                                iconfont icon-fab
                            </v-icon>
                            <span :class="{'red--text':hover||reply.is_support}" class="font-2"
                                  v-if="reply.support===0">赞</span>
                            <span :class="{'red--text':hover||reply.is_support}" class="font-2"
                                  v-else>{{reply.support}}</span>
                        </a>
                    </v-hover>
                    <v-hover class="ml-3 grey--text">
                        <a slot-scope="{ hover }" @click="replyComment" ref="replyButton">
                            <v-icon size="22" :class="{'green--text text--light-1':hover}">iconfont icon-reply1
                            </v-icon>
                            <span class="font-2" :class="{'green--text text--light-1':hover}">回复</span>
                        </a>
                    </v-hover>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex md4 class="text-md-right grey--text">
                    <v-hover v-if="reply.allow_delete">
                        <transition name="fade" slot-scope="{ hover }">
                            <v-tooltip bottom v-show="show">
                                <a slot="activator" @click="deleteReply">
                                    <v-icon size="22" :class="{'blue--text':hover}">iconfont icon-delete1</v-icon>
                                </a>
                                <span>删除</span>
                            </v-tooltip>
                        </transition>
                    </v-hover>
                    <v-hover class="ml-3">
                        <transition name="fade" slot-scope="{ hover }">
                            <v-tooltip bottom v-show="show" dark>
                                <a slot="activator">
                                    <v-icon size="22" :class="{'orange--text':hover}">iconfont icon-icon_tip_off
                                    </v-icon>
                                </a>
                                <span>举报</span>
                            </v-tooltip>
                        </transition>
                    </v-hover>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
  import { transformTime } from '../../utils'
  import { ArticleCommentApi } from '../../api/ArticleCommentApi'

  let $articleCommentApi
  export default {
	name: 'replyTemplate',
	props: {
	  reply: {
		type: Object
	  },
	  user: {
		type: Object
	  },
	  commentIndex: {
		type: Number
	  },
	  replyIndex: {
		type: Number
	  }
	},
	mounted () {
	  this.createTime = transformTime(this.reply.create_time)
	  $articleCommentApi = new ArticleCommentApi(this.$store)
	},
	beforeDestroy () {
	},
	data: function () {
	  return {
		createTime: '',
		show: false,
	  }
	},
	methods: {
	  replyComment () {
		if ( this.$store.state.isLogin ) {
		  this.$emit('reply', this.user)
		} else {
		  this.$message.warning('请先登录！')
		}
	  },
	  deleteReply () {
		if ( this.reply.allow_delete ) {
		  this.$emit('deleteCommentReply', this.commentIndex, this.replyIndex)
		}

	  },
	  support () {
		if ( this.$store.state.isLogin ) {
		  if ( !this.reply.is_author ) {
			if ( !this.reply.allow_vote ) {
			  this.$message.warning('抱歉，您不能投票！')
			} else {
			  this.$emit('support', false, this.commentIndex, this.reply.is_support, this.reply.reply_id, this.replyIndex)
			}
		  } else {
			this.$message.warning('您不能给自己投票！')
		  }
		} else {
		  this.$message.warning('请先登录！')
		}
	  },
	}
  }
</script>

<style scoped>
    p {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    a span {
        color: #9e9e9e;
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    }

    a {
        color: #1890FF !important;
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    }
</style>
