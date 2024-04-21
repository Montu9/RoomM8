const ajvInstance = require("../ajvInstance");

const groupSchemaNewMember = {
    type: "object",
    properties: {
        id_user: { type: "string" },
        role: { type: "string", enum: ["member", "owner"] },
    },
    required: ["id_user", "role"],
    additionalProperties: false,
    errorMessage: {
        required: "The form should have all fields filled in.",
        properties: {
            id_user: "Something wrong with user ID",
            role: "Something worng with role.",
        },
        additionalProperties: "Passed additional incorrect data.",
        _: "Something wrong with filled data.",
    },
};

module.exports = ajvInstance.compile(groupSchemaNewMember);
