<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <el-table
      :data="tradeMarkList"
      v-loading="loading"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO"
        ><template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="LOGO" class="trademark-img"
        /></template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateTrademarkList(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTardemarkList(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--  $event 在自定义事件中代表的是第一个参数 -->
    <!-- 会有一个小问题：当修改每页显示的总数量的时候，当前页是最后一页的时候，页数的数量，会发生变化，当前页就会发生变化，会在发送一次请求，但是这时候limit还没有更新，发送的数据就不对，显示的就不对，使用sync解决，先更新数据，在发送请求 -->
    <el-pagination
      @size-change="getTradeMarkList(page, $event)"
      @current-change="getTradeMarkList($event, limit)"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout=" prev, pager, next, jumper, sizes, total"
      :total="total"
      class="trademark-pagination"
    >
    </el-pagination>

    <!-- 添加按钮的弹窗 -->
    <el-dialog
      :title="`${tradeMarkForm.id ? '修改' : '添加'}品牌属性`"
      :visible.sync="tradeMarkVisible"
      width="50%"
    >
      <!-- 品牌属性的表单 -->
      <el-form
        ref="form"
        :model="tradeMarkForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="品牌属性" prop="tmName">
          <el-input v-model="tradeMarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${this.$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeMarkForm.logoUrl"
              :src="tradeMarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="tradeMarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 可以不用引入api直接使用$API,已将在挂载到原型对象上了
// import trademark from "@/api/product/trademark";

export default {
  name: "TrademarkList",
  data() {
    return {
      tradeMarkList: [], // 列表所有品牌的数据
      page: 1, // 当前页
      limit: 3, // 当前页展示多少数据
      total: 0, // 总数
      tradeMarkVisible: false, // 控制弹窗的隐藏和显示
      loading: false, // loading图片加载图片
      tradeMarkForm: {
        tmName: "", // 属性名称
        logoUrl: "", // logo地址
      }, // 添加弹框品牌表单的数据
      rules: {
        // 表单校验，是必填的，提示，在表单失去焦点时触发
        tmName: [
          { required: true, message: "请输入品牌属性", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  methods: {
    // 定义请求列表数据的方法
    async getTradeMarkList(page, limit) {
      // 发送请求前显示loading图片
      this.loading = true;
      // 发送请求
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        // this.$message.success("数据列表请求成功");
        this.tradeMarkList = result.data.records;
        this.page = result.data.current; // 修改当前页
        this.limit = result.data.size; // 修改显示条数
        this.total = result.data.total; // 获取数据的总数
      } else {
        this.$message.error("数据列表请求失败");
      }
      // 发送请求完后隐藏loading图片
      this.loading = false;
    },
    // 当每页显示的数据变化时
    // handleSizeChange() {},
    // 当前页变化时
    // handleCurrentChange() {},

    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // 将图片的地址赋值给tradeMarkForm.imageUrl
      this.tradeMarkForm.logoUrl = res.data;
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
      return isImgType && isImgType;
    },
    // 表单提交事件
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        // 是否有值
        if (valid) {
          // 判断值是否进行了修改
          const isUpdate = !!this.tradeMarkForm.id;
          // 要先确定是修改数据操作
          if (isUpdate) {
            const tradeMarkItem = this.tradeMarkList.find(
              (item) => item.id === this.tradeMarkForm.id
            );
            // 在判断是否修改了数据值
            if (
              this.tradeMarkForm.tmName === tradeMarkItem.tmName &&
              this.tradeMarkForm.logoUrl === tradeMarkItem.logoUrl
            ) {
              this.$message.warning("不能提交相同数据");
              return;
            }
          }

          // 根据是否有id值判断是修改还是添加，变量定义在外面
          let result;
          if (isUpdate) {
            // 有id值是修改数据
            result = await this.$API.trademark.updateTradeMarkList(
              this.tradeMarkForm
            );
          } else {
            // 没有id值是添加数据值
            result = await this.$API.trademark.addTradeMarkList(
              this.tradeMarkForm
            );
          }
          // 判断返回的数据功能是否成功
          if (result.code === 200) {
            // this.$message.success("数据列表请求成功");
            this.tradeMarkVisible = false;
            this.getTradeMarkList(this.page, this.limit); // 更新一下数据
          } else {
            this.$message.error("数据列表请求失败");
          }
        }
      });
    },

    // 删除数据
    deleteTardemarkList(trademark) {
      this.$confirm(`确定删除${trademark.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(222);
          const result = await this.$API.trademark.deleteTradeMarkList(
            trademark.id
          );
          if (result.code === 200) {
            this.$message.success("删除成功");
            console.log(this.tradeMarkList.length);
            this.getTradeMarkList(
              this.tradeMarkList.length === 1 ? this.page - 1 : this.page,
              this.limit
            ); // 更新一下数据
          } else {
            this.$message.error("数据删除失败");
          }
          // this.$message({
          //   type: "success",
          //   message: "删除成功!",
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改数据
    updateTrademarkList(trademark) {
      // 清空表单的校验结果
      this.$refs.form && this.$refs.form.clearValidate();
      // 让弹窗显示
      this.tradeMarkVisible = true;
      // 进行赋值
      this.tradeMarkForm = { ...trademark }; // 这里要使用结构赋值，赋值一个新的对象，这样就不会修改trademark上的数据
    },
    // 添加
    add() {
      // 清空表单的校验结果
      this.$refs.form && this.$refs.form.clearValidate();
      this.tradeMarkVisible = true;
      this.tradeMarkForm = {
        tmName: "",
        logoUrl: "",
      }; // 把from表单的数据清空，这样显示的数据就是空的，表单的数据是双向的v-model
    },
  },
  async mounted() {
    // 获取所有的品牌数据
    // const tradeMarkList = await trademark.getTradeMarkList();
    // this.tradeMarkList = tradeMarkList.data;
    this.getTradeMarkList(this.page, this.limit);
  },
};
</script>
<style lang="sass" scoped>
>>>.trademark-img
  width: 100px
>>>.trademark-pagination
  text-align: right
>>>.el-pagination__sizes
  margin-left: 250px
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
