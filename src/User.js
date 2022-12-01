import rootConfig from "./request";
import { users } from "drupal-vuejs";
export default {
  ...users,
  ...rootConfig,
};
