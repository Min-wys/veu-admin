// export { default as login } from "./acl/login"; // {default: {}}
// export { default as user } from "./acl/user";
// export { default as role } from "./acl/role";
// export { default as permission } from "./acl/permission";
// export { default as category } from "./category";
// export { default as clientUser } from "./clientUser";
// export { default as order } from "./order";
// export { default as trademark } from "./product/trademark";
// // 引入商品属性
// export { default as attr } from "./product/attr";
// export { default as spu } from "./product/spu";
// export { default as sku } from "./product/sku";

//处理当前目录下的所有js文件
const context = require.context(".", true, /\.js$/);

// 首先将最外层的index.js去除掉
const pathFilter = context.keys().filter(item => item != "./index.js");

// context.keys()拿到所有的路径组成数组
const ObjPath = pathFilter.reduce((modules, modulePath) => {
  // 得到处理后的路径
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const [first, second] = moduleName.split("/");
  if (second === "index") {
    // console.log(first, second);
    modules[first] = context(modulePath).default;
  }
  if (second !== "index") {
    modules[second] = context(modulePath).default;
  }
  return modules;
}, {});

console.log(ObjPath);

export default { ...ObjPath };
