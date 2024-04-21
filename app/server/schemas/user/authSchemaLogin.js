const ajvInstance = require("../ajvInstance");

const authSchemaLogin = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        passwd: { type: "string", pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" },
    },
    required: ["email", "passwd"],
    additionalProperties: false,
    errorMessage: {
        required: "The form should have all fields filled in.",
        properties: {
            email: "Incorrect email address.",
            passwd: "Incorrect password.",
        },
        additionalProperties: "Passed additional incorrect data.",
        _: "Something wrong with filled data.",
    },
};

module.exports = ajvInstance.compile(authSchemaLogin);
