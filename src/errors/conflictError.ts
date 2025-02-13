export function conflictError(resource: string) {
  return {
      type: "conflict",
      message: `${resource} already exists!`
  }
}