import fs from "fs";
const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
const keys = envFile.split("\n").map(l => l.split("=")[0].trim()).filter(Boolean);
console.log("Env keys available:", keys);
