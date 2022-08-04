<template>
   <div @click="changRouter" :to="`playlistDetails?id=${id}`" class="ranking-item">
        <div class="img">
            <slot name="img"></slot>
            <div class="tag">
                <slot name="tag"></slot>
            </div>
            <div class="play-count">
                <slot name="count"></slot>
            </div>
        </div>
        <div class="name">
            <slot name="title"></slot>
        </div>
   </div>
</template>

<script>
  export default {
      props: ['id'],
      methods: {
          changRouter() {
              this.$router.push(`/playlistDetails?id=${this.id}`)
          }
      }
  }

</script>

<style lang='less' scoped>
    .ranking-item {
        display: block;
        width: 31%;
        box-sizing: border-box;
        .img {
            position: relative;
            width: 100%;
            img {
                width: 100%;
                border-radius: 10px;
            }
        }
        .name {
            font-size: 15px;
            margin-top: 3px;
            margin-bottom: 15px;
            font-size: 15px;
        }
        .tag {
            position: absolute;
            top: 3px;
            right: 5px;
            padding: 1px 5px;
            color: white;
            background-color: rgba(206, 200, 200, 0.5);
            border-radius: 10px;
            font-size: 12px;
        }
        .play-count {
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: white;
            font-size: 12px;
            padding: 0px 5px;
            background-color:rgba(206, 200, 200, 0.4);
            border-radius: 10px;
        }
    }
</style>