<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="attrList" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="attrList.category1Id" placeholder="请选择">
            <el-option
              :label="category1Id.name"
              value="category1Id.name"
              v-for="category1Id in attrList.category1Id"
              :key="category1Id.id"
            ></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="attrList.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="attrList.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 下面区域 -->
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="add"
        >添加属性</el-button
      >
      <el-table :data="tradeMarkList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column prop="tmName" label="属性名称" width="150">
        </el-table-column>

        <el-table-column label="属性值列表"
          ><template slot-scope="scope">
            <img :src="scope.row.logoUrl" alt="LOGO" class="trademark-img"
          /></template>
        </el-table-column>

        <el-table-column prop="address" label="操作" width="150">
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      attrList: {
        category1Id: [], // 一级列表数据
        category2Id: "",
        category3Id: "",
      },
    };
  },
  async mounted() {
    const result = await this.$API.attr.getCategory1();
    this.attrList.category1Id = result.data;
  },
};
</script>
