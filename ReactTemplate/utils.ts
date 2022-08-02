import { parse } from "./deps.ts";

export type FileType = "fc" | "hook";

const parseArgs = (
  _args: string[],
): { type: FileType; name: string; help: boolean } => {
  const args = parse(_args);

  const type: FileType = (() => {
    const type = args.t || args.type;
    switch (type) {
      case "hook":
      case "h":
        return "hook";
      case "fc":
      case "f":
        return "fc";
      default:
        return "fc";
    }
  })();

  const name = (() => {
    const name = args.n || args.name || args._[0];

    if (type === "fc") {
      return name;
    }
    //hookの場合はusexxxの形式にする
    if (name.startsWith("use")) {
      return name;
    }
    return `use${capitalizeFirst(name)}`;
  })();

  return {
    name,
    type,
    help: args.hasOwnProperty("h") || args.hasOwnProperty("help"),
  };
};

// 1文字目を大文字に変換
const capitalizeFirst = (text: string) => {
  const first = text.slice(0, 1);
  return text.replace(first, first.toUpperCase());
};

// templateの中身をファイル名に合わせて置換する
const replaceTemplate = (
  { templateText, type, fileName }: {
    templateText: string;
    type: FileType;
    fileName: string;
  },
): string => {
  const keyword = (() => {
    if (type === "fc") {
      return fileName;
    }

    if (fileName.startsWith("use")) {
      return fileName.slice(3);
    }
    return fileName;
  })();

  return templateText.replaceAll("Sample", capitalizeFirst(keyword)).replaceAll(
    "// @ts-nocheck\n",
    "",
  ).replaceAll(";", "");
};

export { capitalizeFirst, parseArgs, replaceTemplate };
