"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emailing = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
class Emailing {
    constructor(to, from) {
        this.to = to;
        this.from = from || String(process.env.SUPPORT_EMAIL);
        // Init the mailer instance
        mail_1.default.setApiKey(String(process.env.SENDGRID_API_KEY));
    }
    async resetPasswordRequest(username, resetUrl) {
        await mail_1.default.send([
            {
                to: this.to,
                from: this.from,
                templateId: String(process.env.SENDGRID_USER_PASSWORD_RESET_REQUEST),
                dynamicTemplateData: {
                    username,
                    resetUrl,
                },
            },
        ]);
    }
    async resetPasswordNotification(username) {
        await mail_1.default.send([
            {
                to: this.to,
                from: this.from,
                templateId: String(process.env.SENDGRID_USER_PASSWORD_RESET_REQUEST),
                dynamicTemplateData: {
                    username,
                },
            },
        ]);
    }
}
exports.Emailing = Emailing;
//# sourceMappingURL=Emailing.js.map