export const COUPON_ACTIVE =
  (process.env.NEXT_PUBLIC_COUPON_ACTIVE || "false") === "true";

export const COUPON_CODE =
  process.env.NEXT_PUBLIC_COUPON_CODE || "COUPON12";

export const COUPON_DISCOUNT =
  parseFloat(process.env.NEXT_PUBLIC_COUPON_DISCOUNT || "0.12");
