export const paths = {
  room: (id: string): string => `/room/${id}`,
  settings: (id: string): string => `/room/${id}/settings`,
  index: (): string => "/",
  invites: (): string => "/invites",
  signIn: (): string => "/signIn",
  notFound: (): string => "/notFound",
};
