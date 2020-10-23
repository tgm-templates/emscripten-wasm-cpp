cmake_minimum_required(VERSION 3.17)
project(@moduleName@)

set(CMAKE_CXX_STANDARD 17)

set(emscripten_dir "~/github/emscripten-core/emsdk")

add_definitions(-std=c++17 -O3)

include_directories("${emscripten_dir}/upstream/emscripten/system/include")

add_executable(@moduleName@_es library.cpp)
set_target_properties(@moduleName@_es PROPERTIES LINK_FLAGS "--bind -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o @moduleName@_es.js -s EXPORT_ES6=1 -s MODULARIZE=1")

add_executable(@moduleName@_node library.cpp)
set_target_properties(@moduleName@_node PROPERTIES LINK_FLAGS "--bind -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o @moduleName@_node.js -s MODULARIZE")


add_custom_command(TARGET @moduleName@_es
        POST_BUILD
        COMMAND deno run --unstable -A ${CMAKE_CURRENT_SOURCE_DIR}/build.ts ${CMAKE_SOURCE_DIR} ${CMAKE_CURRENT_BINARY_DIR}
        VERBATIM
        )
