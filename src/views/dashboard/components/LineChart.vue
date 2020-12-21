<template>
  <div ref="LineChartContainer" class="line-chart-container"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  name: "LineChart",
  props: {
    // 接受数据
    chartData: Object,
    yTittle: String,
  },
  mixins: [resize],
  watch: {
    chartData({ expectedData, actualData }) {
      this.setOption({ expectedData, actualData });
    },
  },
  methods: {
    // 初始化实例
    initChart() {
      this.chart = echarts.init(this.$refs.LineChartContainer, "macarons");
    },
    // 设置实例
    setOption({ expectedData, actualData }) {
      const option = {
        title: {
          text: this.yTittle,
        },
        // 提示 十字架
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        // 代表数据
        legend: {
          data: ["预期", "实际"],
        },
        // 右上角可以保存图片的按钮
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          containLabel: true, // 充满整个容器放置
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "交易金额(万元)",
          },
        ],
        series: [
          {
            name: "预期",
            type: "line",
            // stack: "总量",
            // areaStyle: {}, // 有没有区域颜色
            data: expectedData,
            smooth: true, // 平滑
            lineStyle: {
              color: "red",
            },
          },
          {
            name: "实际",
            type: "line",
            // stack: "总量",
            areaStyle: {
              color: "gray",
              opacity: 0.1,
            },
            data: actualData,
            smooth: true, // 平滑
            lineStyle: {
              color: "blue",
            },
          },
        ],
      };
      // 调用setOption生成图片
      this.chart.setOption(option);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>
<style lang="sass">
.line-chart-container
  width: 100%
  height: 400px
</style>
