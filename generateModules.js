import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

global.crypto = crypto.webcrypto;

const emptyList = Array.from({ length: 500 });

const randomString = (length = 8) => {
  const hexStringLength = 2;
  let values = new Uint8Array(length / hexStringLength);
  crypto.getRandomValues(values);
  return Array.from(values, (value) =>
    value.toString(16).padStart(hexStringLength, "0")
  ).join("");
};

const randomStrings = emptyList.map(() => randomString());

await fs.promises.rm("src/components", { force: true, recursive: true });
await fs.promises.mkdir("src/components", { recursive: true });

await Promise.all(
  randomStrings.map(async (randomString) =>
    fs.promises.writeFile(
      path.join("src/components", `${randomString}.js`),
      `export default '${randomString}'`
    )
  )
);

await fs.promises.writeFile(
  "src/components.jsx",
  `${randomStrings
    .map(
      (randomString) =>
        `import component_${randomString} from './components/${randomString}.js'`
    )
    .join("\n")}

export default () => <ul>
${randomStrings
  .map((randomString) => `  <li>{component_${randomString}}</li>`)
  .join("\n")}
</ul>`
);

// fs.promises.writeFile()
