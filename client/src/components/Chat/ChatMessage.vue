<template>
  <div class="msg" :class="{ mymsg: owner }">
    <img
      :src="getImage(imageId, google, googleImage)"
      v-if="owner && last && seen"
    />
    <img :src="getImage(imageId, google, googleImage)" v-if="!owner && last" />
    <div class="status">
      <i
        class="fa fa-check-circle"
        v-if="owner && !seen"
        :class="{ delivered: delivered }"
      ></i>
    </div>
    <p class="msgText">
      {{ msgText }}
    </p>
  </div>
</template>

<script>
import { default as getImage } from "../../mixins/getImage";
export default {
  name: "BoardPins",
  mixins: [getImage],
  props: {
    imageId: {
      type: String
    },
    msgText: {
      type: String
    },
    owner: {
      type: Boolean
    },
    timeStamp: {},
    last: {
      type: Boolean
    },
    seen: {
      type: Boolean
    },
    delivered: {
      type: Boolean
    },
    google: {
      type: Boolean
    },
    googleImage: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
.msg {
  display: flex;
  margin: 5px 0;
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
}
.mymsg {
  flex-direction: row-reverse;
}
p {
  margin: 0;
  font-size: 16px;
  min-height: 48px;
  padding: 10px;
  background-color: $offWhite;
  border-radius: 32px;
  max-width: 70%;
  word-break: break-all;
  position: relative;
  color: $darkBlue;
}
.fa-check-circle {
  color: white;
  background-color: $lightPink;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  padding-left: 1.5px;
  margin: 6px 2px;
}
.delivered {
  background-color: $darkBlue;
}
.status {
  display: flex;
  flex-direction: column-reverse;
}

@media screen and (max-width: 360px) {
  .msg {
    margin: 3px 0;
    img {
      width: 30px;
      height: 30px;
    }
  }
  p {
    font-size: 14px;
    min-height: 30px;
    padding: 8px;
    border-radius: 16px;
  }
}
</style>
