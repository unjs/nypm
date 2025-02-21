import { writeFileSync } from "node:fs";
import { resolve } from "pathe";

const filePath = resolve("test-file.txt");

writeFileSync(filePath, "", "utf8");
