export function unauthorizedError(resource: string) {
  return {
      type: "unauthorized",
      message: `${resource} unauthorized!`
  }
}