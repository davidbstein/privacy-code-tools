import { get } from "lodash";

const getStackTrace = function () {
  const obj = {};
  Error.captureStackTrace(obj, getStackTrace);
  return `${obj.stack}`.substr(6);
};

export default function Logger(topic, color, extra_styles) {
  return ((msg, ...args) => {
    const ts = new Date().toLocaleTimeString();
    const tag = `[${topic}] [${ts}] `;
    const stack = getStackTrace().replaceAll("\n", `\n${tag} `);

    console.groupCollapsed(`%c${tag}${msg}`, `color: ${color}; ${extra_styles ? extra_styles : ""}`);
    console.debug(`%c${tag}${stack}`, `color: ${color}; ${extra_styles ? extra_styles : ""}`);
    console.groupEnd();
  }).bind(this);
}
