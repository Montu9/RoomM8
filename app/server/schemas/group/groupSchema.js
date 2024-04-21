const ajvInstance = require("../ajvInstance");

const createGroupSchema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 3, pattern: "^[a-zA-Z0-9_.-]+$" },
    },
    required: ["name"],
    additionalProperties: false,
    errorMessage: {
        required: "The form should have all fields filled in.",
        properties: {
            name: "Invalid value.",
        },
        additionalProperties: "Passed additional incorrect data.",
        _: "Something wrong with filled data.",
    },
};

module.exports = ajvInstance.compile(createGroupSchema);
