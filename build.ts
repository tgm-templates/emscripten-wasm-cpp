import {encode as base64} from "https://deno.land/std@0.74.0/encoding/base64.ts";
import {existsSync} from "https://deno.land/std@0.74.0/fs/mod.ts";
import {compress} from "https://deno.land/x/lz4@v0.1.2/mod.ts";

let moduleName = "@moduleName@";
let appDir = ".";
let buildDir = "cmake-build-release";
if (Deno.args.length > 0) {
    appDir = Deno.args[0];
    buildDir = Deno.args[1];
}
const wasmFile = `${buildDir}/${moduleName}_es.wasm`;
const jsFile = `${buildDir}/${moduleName}_es.js`;

async function processModTs(wasmFile: string) {
    //encode wasm binary file with lz4
    const wasm = await Deno.readFile(wasmFile);
    const compressed = compress(wasm);
    const encodedWasmText = base64(compressed);
    // process markdown.deno.js for Deno
    const modTsFile = `${appDir}/mod.ts`;
    if (existsSync(modTsFile)) {
        let modTsCode = await Deno.readTextFile(modTsFile);
        let begin = modTsCode.indexOf('atob("');
        let first = modTsCode.substring(0, begin + 6);
        let second = modTsCode.substring(begin + 6);
        second = second.substr(second.indexOf('"'));
        modTsCode = first + encodedWasmText + second;
        await Deno.writeTextFile(modTsFile, modTsCode);
    }
    console.log("mod.ts proceeded successfully!")
}

async function convertEsModuleFile(jsFile: string) {
    let jsCode = await Deno.readTextFile(jsFile);
    if (jsCode.indexOf("utf-16le") > 0) {
        jsCode = jsCode.replace("utf-16le", "utf-8");
        jsCode = "var document={};\n" + jsCode;
        await Deno.writeTextFile(jsFile, jsCode);
        console.log(`Success to convert ${jsFile}!`)
    }
}

if (existsSync(buildDir)) {
    await convertEsModuleFile(jsFile);
    await processModTs(wasmFile);
} else {
    console.log("Please use emcc_camke.sh build first!")
}

