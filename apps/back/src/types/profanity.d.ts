import type { leoProfanity as Original } from "leo-profanity";

declare module "leo-profanity" {
  const leoProfanity: typeof Original & { default?: typeof Original };
  export default leoProfanity;
}
