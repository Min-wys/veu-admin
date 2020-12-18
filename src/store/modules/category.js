import { Message } from "element-ui";
import * as API from "@/api";

export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  actions: {
    // 获取一级分类数据
    async getCategory1List({ commit }) {
      const result = await API.attr.getCategory1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error("一级分类请求失败");
      }
    },
    // 获取二级分类数据
    async getCategory2List({ commit }, category1Id) {
      const result = await API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        commit("GET_CATEGORY2_LIST_SUCCESS", {
          category1Id,
          category2List: result.data
        });
      } else {
        Message.error("二级分类请求失败");
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
      }
    },
    // 获取三级分类数据
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST_SUCCESS", {
          category2Id,
          category3List: result.data
        });
      } else {
        Message.error("三级分类请求失败");
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
      }
    }
  },
  mutations: {
    // 一级分类数据
    GET_CATEGORY1_LIST(state, category1List) {
      state.category1List = category1List;
    },
    // 二级分类数据成功
    GET_CATEGORY2_LIST_SUCCESS(state, { category1Id, category2List }) {
      // 进行赋值
      state.category.category1Id = category1Id;
      state.category2List = category2List;
      // 在此点击时，要清空数据
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    // 二级分类数据失败
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      // 进行赋值
      state.category.category1Id = category1Id;
      state.category2List = [];
      // 在此点击时，要清空数据
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    // 3级分类数据成功
    GET_CATEGORY3_LIST_SUCCESS(state, { category2Id, category3List }) {
      // 进行赋值
      state.category.category2Id = category2Id;
      state.category3List = category3List;
      // 在此点击时，要清空数据
      state.category.category3Id = "";
    },
    // 3级分类数据失败
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      // 进行赋值
      state.category.category2Id = category2Id;
      // 在此点击时，要清空数据
      state.category3List = [];
      state.category.category3Id = "";
    },
    // 获取三id
    SET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    }
  },
  getters: {}
};
