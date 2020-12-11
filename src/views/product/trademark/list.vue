<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tradeMarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO"
        ><template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="LOGO" class="trademark-img"
        /></template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  $event 在自定义事件中代表的是第一个参数 -->
    <!-- 会有一个小问题：当修改每页显示的总数量的时候，当前页是最后一页的时候，页数的数量，会发生变化，当前页就会发生变化，会在发送一次请求，但是这时候limit还没有更新，发送的数据就不对，显示的就不对，使用sync解决，先更新数据，在发送请求 -->
    <el-pagination
      @size-change="getTradeMarkList(page, $event)"
      @current-change="getTradeMarkList($event, limit)"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout=" prev, pager, next, jumper, sizes, total"
      :total="total"
      class="trademark-pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
// import trademark from "@/api/product/trademark";

export default {
  name: "TrademarkList",
  data() {
    return {
      tradeMarkList: [], // 所有品牌的数据
      page: 1, // 当前页
      limit: 3, // 当前页展示多少数据
      total: 0, // 总数
    };
  },
  methods: {
    // 定义请求列表数据的方法
    async getTradeMarkList(page, limit) {
      try {
        const result = await this.$API.trademark.getPageList(page, limit);
        console.log(result);
        if (result.code === 200) {
          this.$message.success("数据列表请求成功");
          this.tradeMarkList = result.data.records;
          this.page = result.data.current; // 修改当前页
          this.limit = result.data.size; // 修改显示条数
          this.total = result.data.total; // 获取数据的总数
        } else {
          this.$message.error("数据列表请求失败");
        }
      } catch {
        this.$message.error("数据列表请求失败");
      }
    },
    // 当每页显示的数据变化时
    // handleSizeChange() {},
    // 当前页变化时
    // handleCurrentChange() {},
  },
  async mounted() {
    // 获取所有的品牌数据
    // const tradeMarkList = await trademark.getTradeMarkList();
    // this.tradeMarkList = tradeMarkList.data;
    this.getTradeMarkList(this.page, this.limit);
  },
};
</script>
<style lang="sass">
.trademark-img
  width: 100px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 250px
</style>
