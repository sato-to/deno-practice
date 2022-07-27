import { fromFileUrl, resolve } from "./deps.ts";
import { parseArgs, replaceTemplate } from "./utils.ts";

const { type, name, path, help } = parseArgs(Deno.args);

if (help) {
  console.log("options");
  console.log("-t, --type: hook | h | fc | f");
  console.log("-p, --path: 出力先ディレクトリ");
  console.log("-n, --name: クラス名");
} else {
  const template = (() => {
    switch (type) {
      case "hook":
        return "./templates/hook.tsx";
      case "fc":
        return "./templates/fc.tsx";
      default:
        return "./templates/fc.tsx";
    }
  })();
  const newFilePath = `${path}${name}.tsx`;

  //テンプレートファイルの読み込み
  const text = await Deno.readTextFile(
    fromFileUrl(new URL(template, import.meta.url)),
  );
  //テンプレート置換＆ファイル作成
  await Deno.writeTextFile(
    newFilePath,
    replaceTemplate({ templateText: text, type, fileName: name }),
  );

  console.log(`created: ${resolve(Deno.cwd(), newFilePath)}`);
  console.log("finish");
}
