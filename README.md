ms-frontend

> Frontend of My School

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



## 分支规范

1. 开发新功能需要创建自己的feature分支。命名格式: feature-自定义名称。例如：feature-student
2. dev为开发分支，feature分支开发完成即可合并到dev分支
3. master作为生产环境用的分支，由dev分支合并，任何时间都不能直接修改代码



## 开发规范

1. 写必要注释
2. 接口要在api文件夹指定文件中二次封装，不直接写axios，保证代码语义化。
3. 注释掉的代码不保留，自己打的log提交前删掉。
4. mock数据：config文件夹中index文件，修改proxy地址到yapi即可。
5. 做好数据兜底，不要完全信赖接口。

