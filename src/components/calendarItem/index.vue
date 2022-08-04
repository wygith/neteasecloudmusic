<template>
  <div class="calendar-item">
      <div class="content">
          <div class="top">
            <span class="day">
                {{data.resourceExtInfo.startTime | day}}
            </span>
            <span class="tab">
                {{data | tab}}
            </span>
          </div>
          <div class="context one-title">
              <slot name="context"></slot>
          </div>
      </div>
      <div class="count">
          <span class="icon iconfont icon-lingdang" v-if="showCount">
          </span>
          <div class="num" v-if="showCount">
              {{data.resourceExtInfo.subCount | num}}
          </div>
      </div>
      <div class="img">
          <slot name="img"></slot>
          <span class="icont iconfont icon-icon_play"></span>
      </div>
  </div>
</template>

<script>
export default {
    props: ['data'],
    filters: {
        day(e) {
            var date = new Date()
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setUTCMilliseconds(0)
            var tiem = -(date.getTime() - e)/3600000/24
            if(tiem < 1) {
                return '今天'
            }else if(tiem >= 1 && tiem < 2) {
                return '明天'
            }else if(tiem >= 2 && tiem < 3){
                return '后天'
            }else {
                var startDate = new Date(e)
                return startDate.getMonth() + 1 + '-' + startDate.getDate()
            }
        },
        num(e) {
            if(e >= 10000) {
                return Math.floor(e/10000) + '万'
            }else if(e == undefined) {
            }
            return e
        },
        tab(e) {
            if(e.uiElement.labelTexts) {
                return e.uiElement.labelTexts[0]
            }
            return ''
        }
    },
    computed: {
        showCount() {
            if(this.data.resourceExtInfo.subCount == undefined) {
                return false
            }
            return true
        }
    }
}
</script>

<style lang='less' scope>
 .calendar-item {
     display: flex;
     padding: 10px 15px;
     align-items: center;
     border-top: 1px solid rgb(233, 233, 233);
     .content {
         overflow: hidden;
         flex: 10;
         .top {
             display: flex;
             align-items: center;
             .day {
                 font-size: 10px;
             }
             .tab {
                 font-size: 8px;
                 color: rgb(248, 180, 53);
                 margin-left: 7px;
                 padding: 1px 2px;
                 background-color: rgba(252, 219, 159, 0.2);
                 border-radius: 10px;
             }
         }
         .context {
             font-size: 13.5px;
             margin-top: 12px;
             color: black;
         }
     }
     .count {
         flex: 2.7;
         height: 40px;
         text-align: center;
         .icon {
             padding: 4px;
             font-size: 17px;
             border: 1px solid rgb(223, 222, 222);
             border-radius: 50%;
         }
         .num {
             padding: px 0 0;
             margin-top: 10px;
             font-size: 10px;
             vertical-align: bottom;
         }
     }
     .img {
         position: relative;
         flex: 2;
         img {
             width: 100%;
             height: 100%;
             border-radius: 10px;
         }
         .icon-icon_play {
             position: absolute;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             color: rgba(231, 231, 231, 0.5);
             font-size: 21px;
         }
     }
 }
</style>