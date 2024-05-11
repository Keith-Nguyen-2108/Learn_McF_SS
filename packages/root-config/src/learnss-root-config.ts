import { registerApplication, start, LifeCycles } from "single-spa";

registerApplication({
  name: "@learnss/common",
  app: () => System.import<LifeCycles>("@learnss/common"),
  activeWhen: ["/"],
});

start({
  urlRerouteOnly: true,
});
