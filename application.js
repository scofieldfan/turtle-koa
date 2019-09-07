let http = require("http");
let context = require("./context");
let request = require("./request");
let response = require("./response");

class Application {
    /**
     * 构造函数
     */
    constructor() {
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    /**
     * 开启http server并传入callback
     */
    listen(...args) {
        let server = http.createServer(this.callback());
        server.listen(...args);
    }

    /**
     * 挂载回调函数
     * @param {Function} fn 回调处理函数
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }
    compose() {
        // 将middlewares合并为一个函数，该函数接收一个ctx对象
        console.log("compose....");
        return async ctx => {
            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext);
                };
            }

            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve();
            };
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next);
            }

            await next();
        };
    }

    /**
     * 获取http server所需的callback函数
     * @return {Function} fn
     */
    callback() {
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            let fn = this.compose();
            return fn(ctx).then(respond);
        };
    }
    createContext(req, res) {
        // 针对每个请求，都要创建ctx对象
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    responseBody(ctx) {
        let content = ctx.body;
        if (typeof content === "string") {
            ctx.res.end(content);
        } else if (typeof content === "object") {
            ctx.res.end(JSON.stringify(content));
        }
    }
}

module.exports = Application;
