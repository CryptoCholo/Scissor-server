import rateLimiter from "express-rate-limit";
 
const limiter = rateLimiter({
    max: 10,
    message: "You can't make any more requests at the moment. Try again later",
});
 
export default limiter;