import rateLimit from 'express-rate-limit';

// Limit to 5 submissions per minute per IP
export const submissionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: { error: 'Too many submissions, please try again after a minute.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
