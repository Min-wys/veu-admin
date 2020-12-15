<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <Category :disabled="!isShowList" />
    <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SpuUpdateList
      v-else
      :item="item"
      @spuUpdateListShow="spuUpdateListShow"
      :category3Id="category.category3Id"
    />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import { category } from "@/api";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      category: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    // 关闭更新页面
    spuUpdateListShow(category3Id) {
      this.isShowList = true;
      // 重新请求一下数据
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
    getCategory(category) {
      this.category = category;
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
  mounted() {
    this.$bus.$on("change", this.getCategory);
  },
};
</script>
