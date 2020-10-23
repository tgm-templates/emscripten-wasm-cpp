Emscripten C++ WebAssembly Demo for Deno & Node.js
==================================================

# Install Emscripten First

Please follow: https://emscripten.org/docs/getting_started/downloads.html  and install directory is ~/github/emscripten-core/emsdk

# How to build?

```
$ mkdir cmake-build-release
$ (cd cmake-build-release ; ../emmake.sh ../ ; make)
```

# Run wasm with Deno

```
$ deno run demo.ts
```

# Node.js integration
Please create a demo2.js file with following code:

```
let factory = require('./cmake-build-release/@moduleName@_node');

factory().then((instance) => {
    let result = instance.welcome("WebAssembly");
    console.log(result);
});

```

then run `node demo2.js`

# Clion Integration

CLion with emscripten: Settings > Build, Execution, Deployment > CMake, add following in CMake options:

```
-DCMAKE_TOOLCHAIN_FILE=~/github/emscripten-core/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake
```


