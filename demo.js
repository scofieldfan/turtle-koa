let myKoa = require("./application");
let app = new myKoa();

let responseData = {};

app.use(async (ctx, next) => {
    responseData.name = "tom";
    console.log("a");
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    responseData.age = 16;
    console.log("b");
    await next();
});

app.use(async ctx => {
    responseData.sex = "male";
    console.log("c");
});

app.listen(3000, () => {
    console.log("listening on 3000");
});
