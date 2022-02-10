import Cron from "./Cron";

Cron.install = function(Vue) {
  Vue.component(Cron.name, Cron);
};

export default Cron;
