export function notFoundError(resource: string) {
  return {
      type: "notFound",
      message: `${resource} not found!`
  }
}