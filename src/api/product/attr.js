import request from "@/utils/request";
const API_NAME = "/admin/product";

export default {
  // 获取一级分类列表的数据
  getCategory1() {
    return request({
      method: "GET",
      url: `${API_NAME}/getCategory1`
    });
  },
  // 获取二级分类列表的数据
  getCategory2(category1Id) {
    return request({
      method: "GET",
      url: `${API_NAME}/getCategory2/${category1Id}`
    });
  },
  // 获取三级分类列表的数据
  getCategory3(category2Id) {
    return request({
      method: "GET",
      url: `${API_NAME}/getCategory3/${category2Id}`
    });
  },
  // 获取下面属性列表的数据
  getAttrsList({ category1Id, category2Id, category3Id }) {
    return request({
      method: "GET",
      url: `${API_NAME}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  },
  // 添加商品属性
  saveAttrInfo(data) {
    return request({
      method: "POST",
      url: `${API_NAME}/saveAttrInfo`,
      data
    });
  },
  // 删除商品属性/admin/product/deleteAttr/{attrId}
  delAttrInfo(attrId) {
    return request({
      method: "DELETE",
      url: `${API_NAME}/deleteAttr/${attrId}`,
    });
  }
};
