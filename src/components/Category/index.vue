<template>
  <el-card>
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="category2List(category.category1Id)"
          :disabled="disabled"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          :disabled="disabled"
          @change="category3List(category.category2Id)"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          :disabled="disabled"
          @change="attrsList(category.category3Id)"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "", // 一级列表id
        category2Id: "",
        category3Id: "",
      },
      category1: [],
      category2: [],
      category3: [],
    };
  },
  methods: {
    // 获取二级分类数据
    async category2List(category1) {
      // 清空二级和三级的输入框
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2 = [];
      this.category3 = [];
      // 发送请求
      const result = await this.$API.attr.getCategory2(category1);
      if (result.code === 200) {
        this.$message.success("二级分类请求成功");
        this.category2 = result.data;
      } else {
        this.$message.error("二级分类请求失败");
      }
      this.$bus.$emit("showAttrList");
    },
    // 获取三级分类数据
    async category3List(category2) {
      // 清空三级输入框的数据
      this.category.category3Id = "";
      this.category3 = [];
      const result = await this.$API.attr.getCategory3(category2);
      if (result.code === 200) {
        this.$message.success("三级分类请求成功");
        this.category3 = result.data;
      } else {
        this.$message.error("三级分类请求失败");
      }
      this.$bus.$emit("showAttrList");
    },
    // 获取属性数据
    async attrsList(category3) {
      const attrs = {
        ...this.category,
        category3Id: category3,
      };
      this.$bus.$emit("change", attrs);
    },
  },
  async mounted() {
    // this.category.category3Id = "";
    // 获取一级分类数据
    const result = await this.$API.attr.getCategory1();
    if (result.code === 200) {
      this.$message.success("一级分类请求成功");
      this.category1 = result.data;
    } else {
      this.$message.error("一级分类请求失败");
    }
    this.$bus.$emit("showAttrList");
  },
};
</script>

<style lang="less" scoped>
</style>
