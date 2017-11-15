# gulp-mip-validator

验证 MIP 规范的 gulp 插件

## 安装

``` bash
npm install --save-dev gulp-mip-validator
```

## 使用

```js
const gulp = require('gulp');
const validator = require('gulp-mip-validator');

gulp.task('miphtml:validate', () => {
    return gulp
        .src('dist/**/*.html')
        .pipe(validator.validate());
});
```

### 参数配置

参数名 | 说明 | 类型 | 默认值
--- | --- | --- | ---
throws | 出现验证错误时是否抛异常 | boolean | true
