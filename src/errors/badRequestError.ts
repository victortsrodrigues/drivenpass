export function badRequestError(resource: string) {
  return {
      type: "badRequest",
      message: `${resource} not found!`
  }
}