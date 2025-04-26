import { fromUTF8ToBase64 } from "../../src/global-middlewares/admin-middleware";
import { SETTINGS } from "../../src/settings";

export const createString = (length: number) => {
  let s = "";
  for (let x = 1; x <= length; x++) {
    s += x % 10;
  }
  return s;
};

export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);
