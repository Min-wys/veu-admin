<template>
  <el-card style="margin-top: 20px">
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="!category.category3Id"
      @click="$emit('showUpdateList', { category3Id: category.category3Id })"
      >添加SPU</el-button
    >

    <el-table :data="spuList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>

      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="$emit('showSpuList', { ...row, ...category })"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', { ...row, ...category })"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-popconfirm
            @onConfirm="del(row)"
            :title="`确定删除 ${row.saleAttrName} 吗？`"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></el-button
          ></el-popconfirm>
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
import { mapState, mapActions } from "vuex";

export default {
  name: "SpuShowList",
  data() {
    return {
      spuList: [],
      // category: {
      //   category1Id: "", // 一级列表id
      //   category2Id: "",
      //   category3Id: "",
      // },
      page: 1,
      limit: 3,
      total: 0,
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        if (!category3Id) return;
        this.changeHandle(this.page, this.limit);
      },
      immediate: true, // 一上来触发一次
    },
    "category.category1Id"() {
      this.showAttrListHandle();
    },
    "category.category2Id"() {
      this.showAttrListHandle();
    },
  },
  methods: {
    // 删除数据
    async del(row) {
      const result = await this.$API.spu.deleteSpu(row.id);
      if (result.code === 200) {
        this.$message.success("删除成功");
        // 重新获取一下当前数据
        this.getSpuList(this.page, this.limit);
      } else {
        this.$message.error("删除失败");
      }
    },
    // 获取spu分页数据
    async getSpuList(page, limit) {
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

  // mounted() {
  //   // 当三级列表输入框发生变化时，请求spu分页数据
  //   this.$bus.$on("change", this.changeHandle);
  //   // 当点击一级和二级列表时，要清空数据
  //   this.$bus.$on("showAttrList", this.showAttrListHandle);
  // },
  // beforeDestroy() {
  //   // 要解绑全局事件总线
  //   this.$bus.$off("change", this.changeHandle);
  //   // 解绑全局事件总线事件
  //   this.$bus.$off("showAttrList", this.showAttrListHandle);
  // },
};
</script>

<style>
</style>
