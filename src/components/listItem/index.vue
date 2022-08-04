<template>
   <router-link :to="to" class="list-item" :style="{width: width + 'vw'}">
       <div class="img">
           <slot name="img"></slot>
           <div class="play-count" v-if="isShow">
               <slot name="icon">
                   <span class="iconfont icon-play"></span>
               </slot>
               {{count | filterCount}}
           </div>
           <div v-if="background" class="background"><span class="iconfont icon-icon_play"></span></div>
       </div>
       <p><slot name="title"></slot></p>
   </router-link>
</template>

<script>
  export default {
      props: {
          width: {
              type: Number,
              default: 32
          },
          count: {
              type: Number,
              default: 0
          },
         background: {
             default: false
         },
         to: {
             type: String,
             default: '/home/find'
         }
      },
     data() {
        return {
           
        }
     },
     methods: {
         
     },
     filters: {
         filterCount(count) {
             if(count >= 100000000) {
                 count = Math.floor(count/10000000) / 10 + '亿'
             }
             if(count >= 10000) {
                 count = Math.floor(count/1000) / 10 + '万'
             }
             return count
         }
     },
     computed: {
         isShow() {
             return this.count != 0;
         }
     }
  }

</script>

<style lang='less' scope>
    .list-item {
        position: relative;
        box-sizing: border-box;
        padding: 0 4px;
        .img {
            position: relative;
            width: 100%;
            img {
                width: 100%;
                border-radius: 5px;
            }
            .background {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            background-color: rgba(0, 0, 0, .25);
            .iconfont {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 22px;
                color: rgba(255, 255, 255, .7);
            }
        }
        }
        p {
            margin-top: 2px;
            font-size: 10px;
            overflow: hidden;
        }
        .play-count {
            position: absolute;
            top: 5px;
            right: 10px;
            color: white;
            padding: 0 3px;
            border-radius: 10px;
            font-size: 5px;
            background-color: rgba(0, 0, 0, .5);
            .icon-play {
                color: white;
                font-size: 5px;
            }
        }
    }
</style>