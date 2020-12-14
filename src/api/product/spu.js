import request from "@/utils/request";
const API_NAME = "/admin/product";

export default {
  // 获取商品spu列表
  getBaseSaleAttrList() {
    return request({
      url: `${API_NAME}/getBaseSaleAttrList`,
      method: "GET"
    });
  },
  // 删除商品
  deleteSpu(spuId) {
    return request({
      url: `${API_NAME}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
  // 查询商品基本信息/admin/product/getSpuById/{spuId}
  getSpuById(spuId) {
    return request({
      url: `${API_NAME}/getSpuById/${spuId}`,
      method: "DELETE"
    });
  },
  // 保存商品基本信息/admin/product/saveSpuInfo
  saveSpuInfo(spuId) {
    return request({
      url: `${API_NAME}/saveSpuInfo`,
      method: "POST"
    });
  },
  // 获取分页数据/admin/product/{page}/{limit}
  getSpuList({ page, limit, category3Id }) {
    return request({
      url: `${API_NAME}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  }
};
