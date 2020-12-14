<template>
  <div>
    <!-- <Category
      @change="getAttrsList"
      :disabled="!isShow"
      @showAttrList="showAttrList"
    /> -->
    <Category :disabled="!isShow" />
    <!-- 下面区域 -->
    <el-card style="margin-top: 20px" v-show="isShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttrList"
        :disabled="!category.category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>

        <el-table-column label="属性值列表"
          ><template slot-scope="{ row }">
            <el-tag
              v-for="attrs in row.attrValueList"
              :key="attrs.id"
              style="margin-right: 5px"
              >{{ attrs.valueName }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-popconfirm
              @onConfirm="delAttrList(row)"
              :title="`确定删除 ${row.attrName} 吗？`"
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
    </el-card>

    <!-- 点击修改按钮要显示数据 -->
    <el-card style="margin-top: 20px" v-show="!isShow">
      <el-form ref="form" :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttr"
        :disabled="!attr.attrName"
        >添加属性值</el-button
      >

      <el-table :data="attr.attrValueList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column prop="attrValueList.attrName" label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              ref="input"
              size="mini"
              autofocus
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>
            <span
              style="display: block; width: 100%"
              v-else
              @click="edit(row)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              @onConfirm="delAttr($index)"
              :title="`确定删除 ${row.valueName} 吗？`"
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
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";

export default {
  name: "AttrList",
  data() {
    return {
      attrList: [], //属性值数据
      isShow: true,
      attr: {
        //一行数据
        attrName: "", // 属性名
        attrValueList: [], // 属性值列表
        categoryId: "", // 当前第3级分类ID
        categoryLevel: 3, // 分类级别
      },
      category: {
        //三个id值
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  components: {
    Category,
  },
  // watch: {
  //   category() {
  //     this.attr.attrValueList = [];
  //     // this.category.category3Id = "";
  //   },
  // },
  // 解决获取焦点失效
  // directives: {
  //   focus: {
  //     inserted: function(el) {
  //       el.querySelector("input").focus();
  //     }
  //   }
  // },
  methods: {
    // 子向父级传递数据
    async getAttrsList(category) {
      this.category = category;
      const result = await this.$API.attr.getAttrsList(category);
      if (result.code === 200) {
        this.$message.success("属性数据请求成功");
        this.attrList = result.data;
      } else {
        this.$message.error("属性数据请求失败");
      }
    },
    // 修改数据
    update(row) {
      // 显示
      this.isShow = false;
      // 将点击的这行数据赋值,深度克隆
      this.attr = JSON.parse(JSON.stringify(row));
    },
    // 点击变成输入框
    edit(row) {
      // 给row设置响应式的数据
      this.$set(row, "edit", true);
      // 解决获取焦点失效
      this.$nextTick(() => {
        //自动获取焦点 element组件autofocus失效
        this.$refs.input.focus();
      });
    },
    // 输入框失去焦点
    editCompleted(row, index) {
      console.log(row);
      // 如果输入框的内容是空的，就直接删除掉
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      // 隐藏输入框
      row.edit = false;
    },
    // 添加属性值
    addAttr() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 删除属性,不发送请求，值是修改我们这边的数据，等点击保存是在发送请求，取消就不会删除数据
    delAttr(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    // 点击保存按钮发送请求
    async save() {
      const result = await this.$API.attr.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("属性更新成功");
        // 发送请求更新页面
        this.getAttrsList(this.category);
      } else {
        this.$message.error("属性更新失败");
      }
      // 回到开始页面
      this.isShow = true;
    },
    // 添加属性
    addAttrList() {
      this.isShow = false;
      // 清空之前的数据
      this.attr = {
        attrName: "", // 属性名
        attrValueList: [], // 属性值列表
        categoryId: this.category.category3Id, // 当前第3级分类ID
        categoryLevel: 3, // 分类级别
        id: "",
      };
    },
    // 删除属性
    async delAttrList(row) {
      const result = await this.$API.attr.delAttrInfo(row.id);
      if (result.code === 200) {
        this.$message.success("属性删除成功");
        this.getAttrsList(this.category);
      } else {
        this.$message.error("属性删除失败");
      }
    },
    // 修改三级列表，下面的属性列表要没有
    showAttrList() {
      this.attrList = [];
      this.category.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("change", this.getAttrsList);
    this.$bus.$on("showAttrList", this.showAttrList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.getAttrsList);
    this.$bus.$off("showAttrList", this.showAttrList);
  },
};
</script>
