# React Template

- Reactのテンプレートファイルを作成する

# How to use

```shell
# コマンドを登録
$ deno install --allow-read --allow-write --force --name react-template main.ts

# Custom Hookの雛形を作成
## current directory に Hoge.tsxを作成
react-template -t hook Hoge 
## ../front/app/Hoge.tsxを作成
react-template -t hook -p ../front/app Hoge

# Functional Componentの雛形を作成
react-template -t fc Hoge
```
