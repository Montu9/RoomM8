const ajvInstance = require("../ajvInstance");

const userSchemaPasswd = {
    type: "object",
    properties: {
        passwd: { type: "string", pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" },
        oldPasswd: { type: "string", pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" },
    },
    required: ["passwd", "oldPasswd"],
    additionalProperties: false,
    errorMessage: {
        required: "The form should have all fields filled in.",
        properties: {
            passwd: "Password should have at least 8 characters (upper, lower case letter, digits and special).",
            oldPasswd: "Password should have at least 8 characters (upper, lower case letter, digits and special).",
        },
        additionalProperties: "Passed additional incorrect data.",
        _: "Something wrong with filled data.",
    },
};

module.exports = ajvInstance.compile(userSchemaPasswd);
