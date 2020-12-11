import request from "@/utils/request";
const API_NAME = "/admin/product/baseTrademark";

export default {
  // 获取所有品牌数据
  getTradeMarkList() {
    return request({
      method: "GET",
      url: `${API_NAME}/getTrademarkList`
    });
  },
  /*
  获取订单分页列表(带搜索)
  */
  getPageList(page, limit) {
    return request({
      url: `${API_NAME}/${page}/${limit}`,
      method: "GET",
    });
  }
};
