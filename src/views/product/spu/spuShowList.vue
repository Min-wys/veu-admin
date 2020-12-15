<template>
  <el-card style="margin-top: 20px">
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="!category.category3Id"
      >添加SPU</el-button
    >

    <el-table :data="spuList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>

      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="getSpuList(page, $event)"
      @current-change="getSpuList($event, limit)"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout=" prev, pager, next, jumper, sizes, total"
      :total="total"
      class="trademark-pagination"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      spuList: [],
      category: {
        category1Id: "", // 一级列表id
        category2Id: "",
        category3Id: "",
      },
      page: 1,
      limit: 3,
      total: 0,
    };
  },
  methods: {
    // 获取spu分页数据
    async getSpuList(page = 1, limit = 3) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("spu分页数据获取成功");
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error("spu分页数据获取失败");
      }
    },
    // 三级列表发生变化请求数据
    changeHandle(category) {
      this.category = category;
      this.getSpuList(this.page, this.limit);
    },
    // 当点击一级和二级列表时，要清空数据
    showAttrListHandle() {
      this.spuList = [];
      this.total = 0;
      this.limit = 3;
      this.page = 1;
      // 控制添加spu按钮的选中状态的
      this.category.category3Id = "";
    },
  },
  mounted() {
    // 当三级列表输入框发生变化时，请求spu分页数据
    this.$bus.$on("change", this.changeHandle);
    // 当点击一级和二级列表时，要清空数据
    this.$bus.$on("showAttrList", this.showAttrListHandle);
    this.$bus.$on("showList", this.getSpuList);
  },
  beforeDestroy() {
    // 要解绑全局事件总线
    this.$bus.$off("change", this.changeHandle);
    // 解绑全局事件总线事件
    this.$bus.$off("showAttrList", this.showAttrListHandle);
    this.$bus.$off("showList", this.getSpuList);
  },
};
</script>

<style>
</style>
