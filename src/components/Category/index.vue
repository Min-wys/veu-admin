<template>
  <el-card>
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1(category.category1Id)"
          :disabled="disabled"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          :disabled="disabled"
          @change="handleSelectChange2(category.category2Id)"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          :disabled="disabled"
          @change="handleSelectChange3(category.category3Id)"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
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
      // category1: [],
      // category2: [],
      // category3: [],
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  methods: {
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    // 获取二级分类数据
    async handleSelectChange1(category1) {
      // // 清空二级和三级的输入框
      this.category.category2Id = "";
      this.category.category3Id = "";
      this["category/getCategory2List"](category1);
      this.$bus.$emit("showAttrList");
    },
    // 获取三级分类数据
    async handleSelectChange2(category2) {
      // // 清空三级输入框的数据
      this.category.category3Id = "";
      this["category/getCategory3List"](category2);
      this.$bus.$emit("showAttrList");
    },
    // 获取属性数据
    async handleSelectChange3(category3) {
      const attrs = {
        ...this.category,
        category3Id: category3,
      };
      this["category/SET_CATEGORY3_ID"](category3);
      this.$bus.$emit("change", attrs);
    },
  },
  async mounted() {
    this["category/getCategory1List"]();
    // this.$bus.$emit("showAttrList");
  },
};
</script>

<style lang="less" scoped>
</style>
