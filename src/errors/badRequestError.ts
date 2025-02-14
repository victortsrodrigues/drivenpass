export function badRequestError(resource: string) {
  return {
      type: "badRequest",
      message: `${resource} must be a positive number!`
  }
}