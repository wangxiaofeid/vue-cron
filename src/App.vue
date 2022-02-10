<template>
  <div id="app">
    <Cron v-model="value1" />
    {{ value1 }}
    <Cron v-model="value2" multiple />
    {{ value2 }}
    <Cron v-model="value3" />
    {{ value3 }}
  </div>
</template>

<script>
import Cron from "./Cron";

export default {
  name: "app",
  data() {
    return {
      value1: "6 6 14 ? * 6 *",
      value2: "0 0 0 1,6 * ? *",
      value3: "0 0 0 L 4/12 ? *"
    };
  },
  components: {
    //注册插件
    Cron
  }
};
</script>
