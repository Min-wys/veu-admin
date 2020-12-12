import request from "@/utils/request";
const API_NAME = "/admin/product";

export default {
  // 获取一级分类列表的数据
  getCategory1() {
    return request({
      method: "GET",
      url: `${API_NAME}/getCategory1`
    });
  }
};
