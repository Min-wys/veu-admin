<template>
  <el-card>
    <el-form ref="skuForm" :model="sku" label-width="80px" :rules="rules">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input v-model="sku.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          placeholder="请输入"
          v-model="sku.price"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(KG)" prop="weight">
        <el-input-number
          placeholder="请输入"
          v-model="sku.weight"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述" prop="skuDesc">
        <el-input type="textarea" v-model="sku.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          class="spuList-select"
          v-for="(attr, index) in attrsList"
          :key="attr.id"
        >
          <el-form-item :label="attr.attrName">
            <el-select
              v-model="sku.skuAttrValueList[index]"
              placeholder="请选择"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="spuList-select"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <el-form-item :label="sale.saleAttrName">
            <el-select
              v-model="sku.skuSaleAttrValueList[index]"
              placeholder="请选择"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="`${value.id}-${sale.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="图片列表" prop="skuImageList">
        <el-form-item>
          <el-table
            ref="multipleTable"
            :data="spuImageList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            row-key="id"
          >
            <el-table-column type="selection" width="55" reserve-selection>
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope"
                ><img
                  :src="scope.row.imgUrl"
                  style="display: inline-block; width: 100%; height: 100px"
                  :alt="scope.row.imgName"
              /></template>
            </el-table-column>
            <el-table-column prop="imgUrl" label="名称"> </el-table-column>

            <el-table-column prop="address" label="操作" show-overflow-tooltip>
              <template slot-scope="{ row }"
                ><el-button
                  v-if="!row.isDefault"
                  type="primary"
                  size="mini"
                  @click="setImgDefault(row)"
                  >设置默认</el-button
                >
                <el-tag type="success" v-else>默认</el-tag></template
              >
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sava">保存</el-button>
        <el-button @click="$emit('spuUpdateListShow')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SpuList",
  props: ["skuItem"],
  data() {
    return {
      spu: this.skuItem, // 传递过来的数据值
      sku: {
        // price: "", // 价格
        // skuDesc: "", // 描述
        // skuName: "", // 属性名
        // weight: "", // 重量
        skuAttrValueList: [], // 品台属性id数组
        skuSaleAttrValueList: [], // 销售属性id数组
        skuImageList: [], // 选中的图片列表
      }, // 收集表单数据
      spuSaleAttrList: [], // 当前spu的销售属性数据
      spuImageList: [], // 图片数据
      attrsList: [], // 平台属性
      rules: {
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        weight: [{ required: true, message: "请输入重量", trigger: "blur" }],
        skuDesc: [
          { required: true, message: "请输入规格描述", trigger: "change" },
        ],
        // 平台属性
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        // 图片列表
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },

  methods: {
    clearValidate(prop) {
      // 清空表单校验
      this.$refs.skuForm.clearValidate(prop);
    },
    // 提交
    sava() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          console.log("校验通过");
          // 收集数据
          const { category3Id, tmId, id } = this.spu;
          // this.sku.skuImageList(item=>)
          // 销售属性数据
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (item) => {
              const [saleAttrValueId, spuId] = item.split("-");
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          // 平台属性数据
          // const
          const skuAttrValueList = this.sku.skuAttrValueList.map((item) => {
            const [attrId, valueId] = item.split("-");
            return {
              attrId,
              valueId,
            };
          });
          // 默认图片地址
          const skuDefaultImg = this.sku.skuImageList.find(
            (item) => item.isDefault
          ).imgUrl;
          const sku = {
            ...this.sku,
            category3Id,
            skuSaleAttrValueList,
            skuAttrValueList,
            skuDefaultImg,
            tmId,
            spuId: id,
          };
          const result = await this.$API.sku.saveSkuInfo(sku);
          if (result.code === 200) {
            this.$message.success("添加sku成功！");
            this.$emit("spuUpdateListShow");
          } else {
            this.$message.error("添加sku失败！");
          }
        }
      });
    },
    // 平台属性校验
    skuAttrValueListValidator(rule, value, callback) {
      if (
        this.attrsList.length !== this.sku.skuAttrValueList.length ||
        this.sku.skuAttrValueList.some((item) => !item)
      ) {
        callback(new Error("请选择所有的平台属性"));
        return;
      }
      callback();
    },
    // 销售属性校验
    skuSaleAttrValueListValidator(rule, value, callback) {
      if (
        this.spuSaleAttrList.length !== this.sku.skuSaleAttrValueList.length ||
        this.sku.skuSaleAttrValueList.some((item) => !item)
      ) {
        callback(new Error("请选择所有的销售属性"));
        return;
      }
      callback();
    },
    // 图片校验
    skuImageListValidator(rule, value, callback) {
      if (this.sku.skuImageList.length === 0) {
        callback(new Error("至少选择一张图片"));
        return;
      }
      if (!this.sku.skuImageList.some((item) => item.isDefault)) {
        callback(new Error("请选择一张默认图片"));
        return;
      }
      callback();
    },
    // 图片表格的多选框
    handleSelectionChange(imageList) {
      this.sku.skuImageList = imageList;
    },
    // 设置默认图片
    setImgDefault(row) {
      this.clearValidate("skuImageList");
      // 修改API获取来的数据
      this.spuImageList = this.spuImageList.map((img) => {
        return {
          ...img,
          isDefault: row.id === img.id ? true : false,
        };
      });
      // 修改点击多选生成的新数据
      this.sku.skuImageList = this.sku.skuImageList.map((img) => {
        return {
          ...img,
          isDefault: row.id === img.id ? true : false,
        };
      });
    },
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
      const result = await this.$API.attr.getAttrsList(this.category);
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
