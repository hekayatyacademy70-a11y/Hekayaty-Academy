import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuildPluginPino from "esbuild-plugin-pino";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
globalThis.require = createRequire(import.meta.url);

const ROOT = path.resolve(__dirname, "../..");
const API_OUT = path.resolve(ROOT, "api");

async function buildApi() {
  console.log("🔨 Building API server...");
  
  await build({
    entryPoints: { "index": path.resolve(__dirname, "./src/vercel-entry.ts") },
    bundle: true,
    platform: "node",
    format: "esm",
    outdir: API_OUT,
    outExtension: { ".js": ".mjs" },
    external: [
      "*.node",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "xxhash-addon",
      "bufferutil",
      "utf-8-validate",
      "ssh2",
      "cpu-features",
      "dtrace-provider",
      "isolated-vm",
      "lightningcss",
      "pg-native",
      "oracledb",
      "mongodb-client-encryption",
      "nodemailer",
      "handlebars",
      "knex",
      "typeorm",
      "protobufjs",
      "onnxruntime-node",
      "@tensorflow/*",
      "@prisma/client",
      "@mikro-orm/*",
      "@grpc/*",
      "@swc/*",
      "@aws-sdk/*",
      "@azure/*",
      "@opentelemetry/*",
      "@google-cloud/*",
      "@google/*",
      "googleapis",
      "firebase-admin",
      "@parcel/watcher",
      "@sentry/profiling-node",
      "@tree-sitter/*",
      "aws-sdk",
      "classic-level",
      "dd-trace",
      "ffi-napi",
      "grpc",
      "hiredis",
      "kerberos",
      "leveldown",
      "miniflare",
      "mysql2",
      "newrelic",
      "odbc",
      "piscina",
      "realm",
      "ref-napi",
      "rocksdb",
      "sass-embedded",
      "sequelize",
      "serialport",
      "snappy",
      "tinypool",
      "usb",
      "workerd",
      "wrangler",
      "zeromq",
      "zeromq-prebuilt",
      "playwright",
      "puppeteer",
      "puppeteer-core",
      "electron"
    ],
    plugins: [
      esbuildPluginPino({ transports: ["pino-pretty"] })
    ],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'module';
import __bannerPath from 'path';
import __bannerUrl from 'url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    }
  });

  console.log("✅ API built successfully to", API_OUT);
  
  // List what was created
  const files = fs.readdirSync(API_OUT);
  console.log("📦 API files:", files.join(", "));
}

buildApi().catch((err) => {
  console.error("❌ API build failed:", err);
  process.exit(1);
});
