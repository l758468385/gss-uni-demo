import App from "./App";

import GSSAnalytics from "@/uni_modules/gss-uniapp/index.js";

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});

// 2. 安装插件
app.use(GSSAnalytics, {
  traceid: "your-trace-id", // ✅ 必填，追踪 ID
  user_id: "user-id", // 可选，用户 ID
  app_id: "your-app-id", // 可选，应用 ID
  auto_send_pv: true, // 可选，是否自动发送 PV
  auto_send_scroll: true, // 可选，是否自动滚动触底
  auto_send_outbound: true, // 可选，是否自动跳出事件
});

app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);

  // 2. 安装插件
  app.use(GSSAnalytics, {
    traceid: "your-trace-id", // ✅ 必填，追踪 ID
    user_id: "user-id", // 可选，用户 ID
    app_id: "your-app-id", // 可选，应用 ID
    auto_send_pv: true, // 可选，是否自动发送 PV
    auto_send_scroll: true, // 可选，是否自动滚动触底
    auto_send_outbound: true, // 可选，是否自动跳出事件
  });

  return {
    app,
  };
}
// #endif
