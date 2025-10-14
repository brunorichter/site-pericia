/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./context/authContext.tsx":
/*!*********************************!*\
  !*** ./context/authContext.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst AuthProvider = ({ children })=>{\n    const [isAuthenticated, setIsAuthenticated] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const login = ()=>setIsAuthenticated(true);\n    const logout = ()=>setIsAuthenticated(false);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            isAuthenticated,\n            login,\n            logout\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Projetos\\\\site-pericia\\\\context\\\\authContext.tsx\",\n        lineNumber: 19,\n        columnNumber: 5\n    }, undefined);\n};\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L2F1dGhDb250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQzhFO0FBUTlFLE1BQU1JLDRCQUFjSCxvREFBYUEsQ0FBOEJJO0FBRXhELE1BQU1DLGVBQWtELENBQUMsRUFBRUMsUUFBUSxFQUFFO0lBQzFFLE1BQU0sQ0FBQ0MsaUJBQWlCQyxtQkFBbUIsR0FBR1AsK0NBQVFBLENBQVU7SUFFaEUsTUFBTVEsUUFBUSxJQUFNRCxtQkFBbUI7SUFDdkMsTUFBTUUsU0FBUyxJQUFNRixtQkFBbUI7SUFFeEMscUJBQ0UsOERBQUNMLFlBQVlRLFFBQVE7UUFBQ0MsT0FBTztZQUFFTDtZQUFpQkU7WUFBT0M7UUFBTztrQkFDM0RKOzs7Ozs7QUFHUCxFQUFFO0FBRUssTUFBTU8sVUFBVTtJQUNyQixNQUFNQyxVQUFVWixpREFBVUEsQ0FBQ0M7SUFDM0IsSUFBSVcsWUFBWVYsV0FBVztRQUN6QixNQUFNLElBQUlXLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNULEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yaWNodGVyLXBlcmljaWEtbmV4dC8uL2NvbnRleHQvYXV0aENvbnRleHQudHN4PzU2MjMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VTdGF0ZSwgdXNlQ29udGV4dCwgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xyXG5cclxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XHJcbiAgaXNBdXRoZW50aWNhdGVkOiBib29sZWFuO1xyXG4gIGxvZ2luOiAoKSA9PiB2b2lkO1xyXG4gIGxvZ291dDogKCkgPT4gdm9pZDtcclxufVxyXG5cclxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBBdXRoUHJvdmlkZXI6IFJlYWN0LkZDPHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9PiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICBjb25zdCBbaXNBdXRoZW50aWNhdGVkLCBzZXRJc0F1dGhlbnRpY2F0ZWRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xyXG5cclxuICBjb25zdCBsb2dpbiA9ICgpID0+IHNldElzQXV0aGVudGljYXRlZCh0cnVlKTtcclxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiBzZXRJc0F1dGhlbnRpY2F0ZWQoZmFsc2UpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGlzQXV0aGVudGljYXRlZCwgbG9naW4sIGxvZ291dCB9fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZUF1dGggPSAoKTogQXV0aENvbnRleHRUeXBlID0+IHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gYW4gQXV0aFByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59O1xyXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VDb250ZXh0IiwiQXV0aENvbnRleHQiLCJ1bmRlZmluZWQiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsImlzQXV0aGVudGljYXRlZCIsInNldElzQXV0aGVudGljYXRlZCIsImxvZ2luIiwibG9nb3V0IiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUF1dGgiLCJjb250ZXh0IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./context/authContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_authContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/authContext */ \"./context/authContext.tsx\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_authContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Projetos\\\\site-pericia\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Projetos\\\\site-pericia\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQStCO0FBRXVCO0FBRXZDLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDOUQscUJBQ0UsOERBQUNILDhEQUFZQTtrQkFDWCw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL3JpY2h0ZXItcGVyaWNpYS1uZXh0Ly4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dC9hdXRoQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvQXV0aFByb3ZpZGVyPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();