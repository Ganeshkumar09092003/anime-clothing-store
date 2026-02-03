import { Idempotency } from "../models/idempotency.model.js";

export const idempotencyMiddleware = async (req, res, next) =>{
    const key = req.headers["idempotency-key"];
    if(!key){
        return next();
    }
    const existing = await Idempotency.findOne({key});

    if (existing) {
    return res.status(existing.statusCode).json(existing.response);
  }

  // Hook into response
  const originalJson = res.json.bind(res);

  res.json = async (body) => {
    await Idempotency.create({
      key,
      response: body,
      statusCode: res.statusCode
    });

    return originalJson(body);
  };

  next();
}