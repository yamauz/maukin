<template>
  <c-box class="progress-bar" :w="progress" bg="#024404"></c-box>
</template>

<script>
import { CProgress } from "@chakra-ui/vue";

export default {
  name: "ProgressBar",
  components: {
    CProgress,
  },
  data() {
    return {
      barColor: "blue",
    };
  },
  props: {
    item: Object,
  },
  computed: {
    progress() {
      const progressObj = this.item.textObj.filter(
        (item) => item.type === "progress"
      );

      if (progressObj.length === 0) return;
      const progress = progressObj[0].txt;
      return progress + "%";
    },
  },
};
</script>

<style scoped>
.progress-bar {
  position: absolute;
  height: 100%;
  opacity: 0.2;
  z-index: 10;
}
</style>
