<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu" ref="spuForm" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :value="trademark.id"
            :label="trademark.tmName"
            v-for="trademark in tradeMarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImg">
        <el-upload
          accept="image/*"
          class="avatar-uploader"
          list-type="picture-card"
          :before-upload="beforeAvatarUpload"
          :file-list="forgatSpuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>

      <el-form-item label="销售属性" prop="spuAttr">
        <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
          v-model="spu.sale"
        >
          <el-option
            v-for="sale in filterSaleAttrList"
            :key="sale.id"
            :value="`${sale.id}-${sale.name}`"
            :label="sale.name"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spu.sale"
          @click="addSaleAttr(spu.sale)"
          >添加销售属性</el-button
        >
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
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
                v-for="(attrVal, index) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
              <el-input
                class="input-new-tag"
                v-if="row.edit"
                v-model="inputValue"
                ref="input"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                @onConfirm="delSpuSaleAttr($index)"
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('spuUpdateListShow', spu.category3Id)"
          >取消</el-button
        >
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
      inputValue: "", // 输入框的内容
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        spuTm: [{ required: true, message: "请选择SPU品牌", trigger: "blur" }],
        description: [
          { required: true, message: "请描述SPU品牌描述", trigger: "blur" },
        ],
        spuImg: [{ required: true, validator: this.spuImgValidator }],
        spuAttr: [{ required: true, validator: this.spuAttrValidator }],
      },
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
    // 计算得出新的图片数组
    forgatSpuImageList() {
      return this.spuImageList.map((item) => {
        return {
          // 计算属性也要添加uid属性，一开始没有uid属性，就使用id属性，当uid属性
          uid: item.uid || item.id,
          id: item.id,
          name: item.imgName,
          url: item.imgUrl,
        };
      });
    },
  },
  methods: {
    // 图片校验
    spuImgValidator(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        callback();
        return;
      }
      callback(new Error("请上传至少一张图片~"));
    },
    // 属性校验规则
    spuAttrValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请选择至少一个销售属性~"));
        return;
      }
      const isNotOk = this.spuSaleAttrList.some(
        (item) => item.spuSaleAttrValueList.length === 0
      );
      if (isNotOk) {
        callback(new Error("当前spu的销售属性值必须要有2个"));
        return;
      }
      callback();
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      // 设置白名单
      const imgType = ["image/jpeg", "image/jpg", "image/png"];
      const isImgType = imgType.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isImgType) {
        this.$message.error("上传品牌LOGO只能是 JPG或者是png 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌图片大小不能超过 50kB!");
      }
      return isImgType && isLt;
    },

    // 点击保存按钮
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          // 收集数据
          const spu = {
            ...this.spu,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          let result;
          // 根据id进行判断是修改数据还是删除数据
          if (this.spu.id) {
            // 发送修改请求
            result = await this.$API.spu.updateSpuInfo(spu);
          } else {
            // 发送添加请求
            result = await this.$API.spu.saveSpuInfo(spu);
          }

          if (result.code === 200) {
            this.$message.success("spu数据更新成功");
            this.$emit(
              "spuUpdateListShow",
              this.spu.category3Id || this.category3Id
            );
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 删除属性
    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    // 删除当前属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 显示当前输入框，并获取焦点
    showInput(row) {
      // 给row设置响应式的数据
      this.$set(row, "edit", true);
      // 解决获取焦点失效
      this.$nextTick(() => {
        //自动获取焦点 element组件autofocus失效
        this.$refs.input.focus();
      });
    },
    // 输入框失去焦点时
    handleInputConfirm(row) {
      // 如果输入框的内容有值就直接添加
      if (this.inputValue) {
        //   const spuSaleAttr = {
        //     baseSaleAttrId: row.baseSaleAttrId,
        //     saleAttrName: row.saleAttrName,
        //     saleAttrValueName: this.inputValue,
        //     // spuId: row.spuId,
        //   };
        //   if (this.spu.id) {
        //     spuSaleAttr.spuId = this.spu.id;
        //   }
        //   row.spuSaleAttrValueList.push(spuSaleAttr);
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.inputValue,
          spuId: row.spuId,
        });
        // 清空输入框的内容
        this.inputValue = "";
      }
      // 隐藏输入框
      row.edit = false;
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // const ImageList = {
      //   // 上传图片要添加一个uid属性，才不会出现闪烁的情况
      //   uid: file.uid,
      //   imgName: file.url,
      //   imgUrl: res.data,
      //   // spuId: this.spu.id,
      // };
      // if (this.spu.id) {
      //   ImageList.spuId = this.spu.id;
      // }
      // this.spuImageList.push(ImageList);
      // 给spu图片的数组添加一个数值
      // res返回上传成功结果, file：当前上传的图片信息
      this.spuImageList.push({
        // 上传图片要添加一个uid属性，才不会出现闪烁的情况
        uid: file.uid,
        imgName: file.url,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
    },
    // 点击添加销售属性
    // addSaleAttr(saleAttrId) {
    //   // 找到id对应的所有销售属性
    //   const saleAttr = this.saleAttrList.find(
    //     (saleAttr) => saleAttr.id === saleAttrId
    //   );
    //   // 给当前销售属性值添加数据
    //   this.spuSaleAttrList.push({
    //     saleAttrName: saleAttr.name,
    //     baseSaleAttrId: saleAttrId,
    //     // spuSaleAttrValueList: [
    //     //   {
    //     //     // baseSaleAttrId: saleAttrId,
    //     //     // saleAttrName: saleAttr.name,
    //     //   },
    //     // ],
    //   });
    //   // 清空select的内容
    //   this.spu.saleAttrId = "";
    // },
    // 删除spu图片
    //
    /* 点击添加的方式二：常用！select的v-mode的值和option的value的值相同的，value中传什么值，select就接收什么值 */
    addSaleAttr(sale) {
      // sale的值是${sale.id}-${sale.name}
      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      // const spuSaleAttr = {
      //   saleAttrName,
      //   baseSaleAttrId: +baseSaleAttrId,
      //   spuSaleAttrValueList: [],
      //   // spuId: this.spu.id,
      // };
      // if (this.spu.id) {
      //   spuSaleAttr.spuId = this.spu.id;
      // }
      // this.spuSaleAttrList.push(spuSaleAttr);
      this.spuSaleAttrList.push({
        saleAttrName,
        baseSaleAttrId: +baseSaleAttrId,
        spuSaleAttrValueList: [],
        spuId: this.spu.id,
      });
      // 清空select输入框的数据
      this.spu.sale = "";
    },
    // 删除图片展示的图片数据
    handleRemove(file, fileList) {
      this.spuImageList = this.spuImageList.filter(
        // 比较Url地址是否相同，id无法比较
        (item) => item.imgUrl !== file.url
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
        this.spuImageList = result.data;
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
    // 获取所有spu的销售属性数据
    this.getSaleAttrList();
    // spu的数据id是空的，证明是添加spu是修改，就不需要发送请求
    if (!this.spu.id) return;
    // 获取所有spu的所有图片数据
    this.getSpuImageList();
    // 获取当前spu的销售属性数据
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-tag + .el-tag
  margin-left: 10px

>>>.button-new-tag
  margin-left: 10px
  height: 32px
  line-height: 30px
  padding-top: 0
  padding-bottom: 0

>>>.input-new-tag
  width: 90px
  margin-left: 10px
  vertical-align: bottom
</style>
