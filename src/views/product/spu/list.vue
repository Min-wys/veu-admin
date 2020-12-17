<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <!--
      v-show 组件虽然是隐藏的，但是组件被加载了
     -->
    <SpuList v-if="isShowspuList" :skuItem="skuItem" />

    <div v-else>
      <Category :disabled="!isShowList" />
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSpuList="showSpuList"
      />
      <SpuUpdateList
        v-else
        :item="item"
        @spuUpdateListShow="spuUpdateListShow"
      />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SpuList from "./spuList";
// import { category } from "@/api";

export default {
  name: "List",
  data() {
    return {
      isShowList: true, // 控制添加spu显示隐藏
      item: {},
      isShowspuList: false, // 控制添加sku显示隐藏
      skuItem: {},
    };
  },
  methods: {
    // 点击修改按钮和添加spu是触发
    showUpdateList(row) {
      this.isShowList = false;
      // 克隆数据
      this.item = { ...row };
    },
    // 关闭更新页面
    spuUpdateListShow(category3Id) {
      this.isShowList = true;
      // 重新请求一下数据
      this.$nextTick(() => {
        // 触发spuShowList页面
        this.$bus.$emit("change", { category3Id });
      });
    },
    // 点击加号触发
    showSpuList(row) {
      this.isShowspuList = true;
      this.skuItem = { ...row };
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SpuList,
  },
};
</script>
