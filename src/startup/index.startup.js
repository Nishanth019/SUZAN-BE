const { PORT } = process.env;

module.exports = async (app) => {

  await require("./db.startup")(app); //intiate db connection
  require("./routes.startup")(app); // intiate routes

  //Starting Server
  app.listen(PORT || 8000, () => {
    console.log("🚀 Suzan Server is Running on PORT =>", PORT || 8000);
  });
};
