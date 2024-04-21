const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const addErors = require("ajv-errors");

const ajvInstance = new Ajv({ allErrors: true });
addFormats(ajvInstance);
addErors(ajvInstance);

module.exports = ajvInstance;
