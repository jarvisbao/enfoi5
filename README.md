## 项目启动

```bash
npm run init
下载依赖，因为是批量下载所有应用下的依赖，推荐cinit节省下载时间

npm run serve
运行项目，同样，批量运行所有应用会耗时较久，浏览器页面自动打开后请稍家等待，然后刷新即可
后加项目名字运行指定项目

npm run build
打包项目，打包所有应用
```

## 新建项目
项目名务必以sub_xx开头  
打包项目时,只需要修改对应package.json中的name字段即可  
打包后,除了portal项目外,静态资源皆以/static/name开头  
打包后,子项目入口为/entry/name  
子项目路由需要在顶级路由上使用sub_component:true来使用公用的layout组件  
若需要项目独立运行,需要将portal下的library公共库移到子项目下  
life-cycle.js 
```
import router_permission from './permission'  
router_permission(router)  
``` 
main.js:
``` 
import props from './independent'  
__qiankun__ || bootstrap(props)  
``` 
