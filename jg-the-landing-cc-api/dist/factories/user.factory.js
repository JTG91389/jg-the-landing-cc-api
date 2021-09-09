"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_seeding_1 = require("typeorm-seeding");
const User_1 = require("../entity/User");
typeorm_seeding_1.define(User_1.User, (faker) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const email = faker.internet.email(firstName, lastName);
    const username = faker.internet.userName(firstName, lastName);
    const user = new User_1.User();
    user.username = username.toLowerCase();
    user.email = email.toLowerCase();
    // password123
    user.password =
        '$argon2i$v=19$m=4096,t=3,p=1$Y3kjZvA7z1T42u5PYqS0nQ$Ny/57PjPwzHD9ji405y09ReSgqAPkAT3X3LPUcdVne8';
    return user;
});
//# sourceMappingURL=user.factory.js.map