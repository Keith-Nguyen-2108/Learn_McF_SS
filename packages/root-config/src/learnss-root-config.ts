import { registerApplication, start, LifeCycles } from "single-spa";

registerApplication({
  name: "@learnss/common",
  app: () => System.import<LifeCycles>("@learnss/common"),
  activeWhen: ["/"],
});

registerApplication({
  name: "@learnss/common-react",
  app: () => System.import<LifeCycles>("@learnss/common-react"),
  activeWhen: ["/react"],
});

start({
  urlRerouteOnly: true,
});
