import { RateLimiterMemory } from "rate-limiter-flexible";

const opts = {
  points: 10,
  duration: 20,
};

const rateLimiter = new RateLimiterMemory(opts);

const rateLimiterMiddleware = async (request, h) => {
  try {
    await rateLimiter.consume(request.info.remoteAddress);
    return h.continue;
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    console.log(secs);
    return h
      .response({ error: "Too Many Requests" })
      .code(429)
      .takeover()
      .header("Retry-After", String(secs));
  }
};

export default rateLimiterMiddleware;
