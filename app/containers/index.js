import loadable from "utils/loadable";

export const Auth = loadable(() => import("./Auth"));
export const Basic = loadable(() => import("./Basic"));
export const HomePage = loadable(() => import("./HomePage/index"));
export const MasterData = loadable(() => import("./MasterData"));
export const NotFoundPage = loadable(() => import("./NotFoundPage/index"));
export const Report = loadable(() => import("./Report"));
export const Template = loadable(() => import("./Template"));
