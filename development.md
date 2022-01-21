# 开发步骤

1. 添加或修改snippets文件下的文件
2. 执行`build.sh`生成snippets
3. 修改vscode/CHANGE
4. cd到vscode目录下发布, 执行`vsce publish [major, minor, patch]`自动修改vscode/package.json的版本号并发布
5. 提交到git

## 注意事项

`vsce`使用yarn安装，更新的时候请使用`yarn global upgrade vsce`
