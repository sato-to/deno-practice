import { fromFileUrl, parse, resolve } from "./deps.ts";

const args = parse(Deno.args);
const type: "hook" | "fc" = (() => {
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
const capitalizeFirst = (text: string) => {
  const first = text.slice(0, 1);
  return text.replace(first, first.toUpperCase());
};
const replace = (
  { text, type, name }: {
    text: string;
    type: "hook" | "fc";
    name: string;
  },
): string => {
  const keyword = (() => {
    if (type === "fc") {
      return name;
    }

    if (name.startsWith("use")) {
      return name.slice(3);
    }
    return name;
  })();

  return text.replaceAll("Sample", capitalizeFirst(keyword)).replaceAll(
    "// @ts-ignore\n",
    "",
  ).replaceAll(";", "");
};

const template = (() => {
  switch (type) {
    case "hook":
      return "./templates/hook.tsx";
    case "fc":
      return "./templates/fc.tsx";
  }
})();
const name = args.n || args.name || args._[0];
const newFilePath = (() => {
  const path = (() => {
    const path = args.p || args.path || "./";

    if (path.slice(-1) === "/") {
      return path;
    }
    return path + "/";
  })();

  const fileName = (() => {
    if (type === "fc") {
      return name;
    }
    if (name.startsWith("use")) {
      return name;
    }
    return `use${capitalizeFirst(name)}`;
  })();

  return `${path}${fileName}.tsx`;
})();

const text = await Deno.readTextFile(
  fromFileUrl(new URL(template, import.meta.url)),
);

await Deno.writeTextFile(
  newFilePath,
  replace({ text, type, name }),
);

console.log(`created: ${resolve(Deno.cwd(), newFilePath)}`);
console.log("finish");
