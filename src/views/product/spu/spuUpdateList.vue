<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :value="trademark.id"
            :label="trademark.tmName"
            v-for="trademark in tradeMarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :action="`${$BASE_API}/admin/product/fileUpload`"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
          v-model="spu.saleAttrId"
        >
          <el-option
            v-for="sale in filterSaleAttrList"
            :key="sale.id"
            :value="sale.id"
            :label="sale.name"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="attrVal in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="spuImageUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
import { mounted } from "v-charts/lib/core";
export default {
  name: "SpuUpdateList",
  data() {
    return {
      spu: this.item, // 传递过来的数据
      tradeMarkList: [], // 所有品牌数据
      spuImageList: [], // 所有图片数据
      spuImageUrl: "", // 图片的地址
      dialogVisible: false, // 放大的图片显示
      spuSaleAttrList: [], // 当前spu的销售属性数据
      saleAttrList: [], // 所有spu的销售属性数据
    };
  },
  props: ["item"],
  computed: {
    // 所有的spu的销售属性数据要过滤掉所有spu的销售属性
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        // 返回和所有的id不同的属性
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
  },
  methods: {
    // 删除spu图片
    handleRemove(file, fileList) {
      this.spuImageList = this.spuImageList.filter(
        (item) => item.id !== file.id
      );
    },
    // 处理图片预览
    handlePictureCardPreview(file) {
      this.spuImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取所有品牌数据
    async getTradeMarkList() {
      const result = await this.$API.spu.getTradeMarkList();
      if (result.code === 200) {
        this.$message.success("所有品牌数据获取成功");
        this.tradeMarkList = result.data;
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
        this.spuImageList = result.data.map((item) => {
          return {
            id: item.id,
            name: item.imgName,
            url: item.imgUrl,
          };
        });
      } else {
        this.$message.error(result.message);
      }
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
    // 获取所有spu的销售属性数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("所有spu的销售属性数据获取成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    // 获取所有品牌数据
    this.getTradeMarkList();
    // 获取所有spu的所有图片数据
    this.getSpuImageList();
    // 获取当前spu的销售属性数据
    this.getSpuSaleAttrList();
    // 获取所有spu的销售属性数据
    this.getSaleAttrList();
  },
};
</script>

<style>
</style>
