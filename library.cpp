#include <emscripten/bind.h>

using namespace emscripten;

std::string welcome(const std::string &nick) {
    std::string hello = "Welcome " + nick + "!";
    return hello;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("welcome", &welcome);
}
