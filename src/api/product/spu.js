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
  },
  // 获取所有品牌数据
  getTradeMarkList() {
    return request({
      method: "GET",
      url: `${API_NAME}/baseTrademark/getTrademarkList`
    });
  },
  // 获取spu的所有图片数据GET /admin/product/spuImageList/{spuId}
  getSpuImageList(spuId) {
    return request({
      method: "GET",
      url: `${API_NAME}/spuImageList/${spuId}`
    });
  },
  // 获取当前spu的销售属性数据GET GET /admin/product/spuSaleAttrList/{spuId}
  getSpuSaleAttrList(spuId) {
    return request({
      method: "GET",
      url: `${API_NAME}/spuSaleAttrList/${spuId}`
    });
  },
  // 获取所有spu的销售属性数据
  getSaleAttrList() {
    return request({
      method: "GET",
      url: `${API_NAME}/baseSaleAttrList`
    });
  }
};
