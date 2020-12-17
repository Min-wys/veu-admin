<template>
  <el-card>
    <el-form ref="form" :model="sku" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="sku.akuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          placeholder="请输入"
          v-model="sku.price"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(KG)">
        <el-input-number
          placeholder="请输入"
          v-model="sku.weight"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="sku.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <div
          class="spuList-select"
          v-for="(attr, index) in attrsList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select v-model="sku.attrsId[index]" placeholder="请选择">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="销售属性">
        <div
          class="spuList-select"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select v-model="sku.spuAttrId[index]" placeholder="请选择">
            <el-option
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table ref="multipleTable" :data="spuImageList" style="width: 100%">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgUrl" label="名称"> </el-table-column>

          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template
              ><el-button type="primary" size="mini"
                >设置默认</el-button
              ></template
            >
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SpuList",
  props: ["skuItem"],
  data() {
    return {
      spu: this.skuItem, // 传递过来的数据值
      sku: {
        price: "", // 价格
        skuDesc: "", // 描述
        skuName: "", // 属性名
        weight: "", // 重量
        spuAttrId: [], // 销售属性id数组
        attrsId: [], // 品台属性id数组
      }, // 收集表单数据
      spuSaleAttrList: [], // 当前spu的销售属性数据
      spuImageList: [], // 图片数据
      attrsList: [], // 平台属性
    };
  },
  methods: {
    // 获取当前spu的销售属性数据
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("当前spu的销售属性数据获取成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有spu的所有图片数据
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("所有图片数据获取成功");
        // 进行过滤数值，elementui中要求是name和url的形式
        this.spuImageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取平台属性数据
    async getAttrsList() {
      const result = await this.$API.attr.getAttrsList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
      if (result.code === 200) {
        this.$message.success("所有平台数据获取成功");
        // 进行过滤数值，elementui中要求是name和url的形式
        this.attrsList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    // 获取所有spu的所有图片数据
    this.getSpuImageList();
    // 获取当前spu的销售属性数据
    this.getSpuSaleAttrList();
    // 获取平台属性数据
    this.getAttrsList();
  },
};
</script>

<style lang="sass" scoped>
.spuList-select
  display: inline-block
  margin-right: 20px
>>>.el-input-number .el-input__inner
  text-align: left
</style>
