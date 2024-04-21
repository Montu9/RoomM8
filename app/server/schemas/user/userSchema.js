const ajvInstance = require("../ajvInstance");

const userSchema = {
    type: "object",
    properties: {
        firstname: { type: "string", minLength: 2 },
        lastname: { type: "string", minLength: 2 },
        email: { type: "string", format: "email" },
        passwd: { type: "string", pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$" },
        gender: { type: "string", enum: ["Male", "Female", "Other"] },
    },
    required: ["firstname", "lastname", "email", "passwd", "gender"],
    additionalProperties: false,
    errorMessage: {
        required: "The form should have all fields filled in.",
        properties: {
            firstname: "First name should be at least 2 characters long.",
            lastname: "Last name should be at least 2 characters long.",
            email: "Incorrect email address.",
            passwd: "Password should have at least 8 characters (upper, lower case letter, digits and special).",
            gender: "Incorrect gender.",
        },
        additionalProperties: "Passed additional incorrect data.",
        _: "Something wrong with filled data.",
    },
};

module.exports = ajvInstance.compile(userSchema);
