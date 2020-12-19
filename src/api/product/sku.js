import request from "@/utils/request";
const API_NAME = "/admin/product";

// POST /admin/product/saveSkuInfo
export default {
  saveSkuInfo(sku) {
    return request({
      method: "POST",
      url: `${API_NAME}/saveSkuInfo`,
      data: sku
    });
  }
};
