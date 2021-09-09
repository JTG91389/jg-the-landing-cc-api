"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationChecker = void 0;
const User_1 = require("../entity/User");
const AuthenticationChecker = async ({ context }, roles) => {
    const user = await User_1.User.findOneOrFail(context.req.session.userId);
    if (!roles.includes(String(user.userType))) {
        return false;
    }
    return true;
};
exports.AuthenticationChecker = AuthenticationChecker;
//# sourceMappingURL=AuthenticationChecker.js.map