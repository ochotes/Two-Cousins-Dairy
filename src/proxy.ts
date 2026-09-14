import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthed = await convexAuth.isAuthenticated();
  if (isPublicPage(request)) {
    if (isAuthed) {
      return nextjsMiddlewareRedirect(request, "/");
    }
    return;
  }
  if (!isAuthed) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
