"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowerCaseDirective = void 0;
const apollo_server_1 = require("apollo-server");
const graphql_1 = require("graphql");
class LowerCaseDirective extends apollo_server_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        field.resolve = async (...args) => {
            const result = await resolve.apply(this, args);
            if (typeof result === 'string') {
                return result.toLowerCase();
            }
            return result;
        };
    }
}
exports.LowerCaseDirective = LowerCaseDirective;
//# sourceMappingURL=index.js.map