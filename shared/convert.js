export function convert(module) {
  const { loader, action, default: Component, ...rest } = module;

  return {
    ...rest,
    loader: loader,
    action: action,
    Component,
  };
}
