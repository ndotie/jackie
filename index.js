const { jack, ...jacko } = require("./jackie.linkage");
const CreateModel = require("./createModel");
const CreateRoute = require("./createRoutes");
const CreateController = require("./createController");

[CreateModel, CreateRoute, CreateController].forEach((fn) => fn(jack));
