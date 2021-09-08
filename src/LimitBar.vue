<template>
  <c-progress
    class="limit-progress-bar"
    :has-stripe="isAnimated"
    :is-animated="isAnimated"
    height="2px"
    :color="'cyan'"
    :value="progress"
  />
</template>

<script>
import { CProgress } from "@chakra-ui/vue";
import dayjs from "dayjs";

const HOUR_SEC = 3600;
const MINUTE_SEC = 60;

const validate = (date, format) => {
  return dayjs(date, format).format(format) === date;
};

const setStartTime = (item) => {
  const startTime = item.editedAt ? item.editedAt : item.createdAt;
  return startTime;
};

const setLimitTime = (item, startTime) => {
  const limitObj = item.textObj.filter((item) => item.type === "limit");
  if (limitObj.length === 0) return false;
  const itemLimit = limitObj[0].txt;

  if (validate(itemLimit, "YYYYMMDD")) return dayjs(itemLimit).unix();
  if (validate(itemLimit, "YYYY.MM.DD")) return dayjs(itemLimit).unix();
  if (validate(itemLimit, "YYYY-MM-DD")) return dayjs(itemLimit).unix();
  if (validate(itemLimit, "YYYY/MM/DD")) return dayjs(itemLimit).unix();

  const limitValue = Number(itemLimit.slice(0, -1));
  if (/\dh/.test(itemLimit)) return startTime + limitValue * HOUR_SEC;
  if (/\dm/.test(itemLimit)) return startTime + limitValue * MINUTE_SEC;
  if (/\ds/.test(itemLimit)) return startTime + limitValue;

  return false;
};

const setTotalTime = (startTime, limitTime) => {
  const totalTime = limitTime - startTime;
  return totalTime;
};

export default {
  name: "LimitBar",
  components: {
    CProgress,
  },
  data() {
    return {
      progress: 0,
      barColor: "cyan",
      test: "before",
      interval: null,
      limitTime: Number,
      startTime: Number,
      totalTime: Number,
    };
  },
  props: {
    item: Object,
    editedAt: Number,
  },
  watch: {
    editedAt() {
      this.test = `${this.editedAt} - "after"`;
      this.startTime = setStartTime(this.item);
      this.limitTime = setLimitTime(this.item, this.startTime);

      if (this.limitTime) {
        this.totalTime = setTotalTime(this.startTime, this.limitTime);
        this.clearProgressInterval();
        this.setProgressInterval();
      } else {
        this.clearProgressInterval();
        this.progress = 0;
      }
    },
  },
  destroyed: function() {
    this.clearProgressInterval();
  },
  created: function() {
    this.startTime = setStartTime(this.item);
    this.limitTime = setLimitTime(this.item, this.startTime);
    if (this.limitTime) {
      this.totalTime = setTotalTime(this.startTime, this.limitTime);
    } else {
      this.progress = 0;
      return;
    }

    this.setProgressInterval();
  },
  computed: {
    isAnimated() {
      return this.barColor === "cyan";
    },
  },

  methods: {
    setProgress() {
      const elapsedTime = dayjs().unix() - this.startTime;
      this.progress = (elapsedTime / this.totalTime) * 100;
      if (this.totalTime < 0) {
        this.barColor = "red";
        this.clearProgressInterval();
        return;
      }
      if (this.progress > 100) {
        this.barColor = "red";
        this.clearProgressInterval();
      } else {
        this.barColor = "cyan";
      }
    },
    setProgressInterval() {
      this.setProgress();
      this.interval = setInterval(() => {
        this.setProgress();
      }, 1000);
    },
    clearProgressInterval() {
      clearInterval(this.interval);
    },
  },
};
</script>

<style scoped>
.limit-progress-bar {
  z-index: 100;
  position: absolute;
  bottom: 0;
}
</style>
