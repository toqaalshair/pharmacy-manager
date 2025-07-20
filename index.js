require("dotenv").config();
const app = require("./app");
const { createServer } = require("http");
const server = createServer(app);
server.listen(process.env.PORT, () => {
  console.log("Server is Running........");
});
