async function m1(ctx, next) {
    console.log("m1..");
    next && next();
}
async function m2(ctx, next) {
    console.log("m2..");
    next && next();
}

async function m3(ctx, next) {
    console.log("m3..");
    next && next();
}

function createNext(middleware, oldNext) {
    return async function() {
        await middleware(null, oldNext);
    };
}
let next = () => {
    Promise.resolve().then(() => {
        console.log("end...");
    });
};
const next3 = createNext(m3, next);
const next2 = createNext(m2, next3);
const next1 = createNext(m1, next2);

next1();
