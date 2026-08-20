"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/", (req, res) => {
    res.send("Welcome aboard the second island! Your server is alive. ⚓");
});
app.listen(port, () => {
    console.log(`Server is sailing at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map