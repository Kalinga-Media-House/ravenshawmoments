import { SessionService } from "../session.service";
import { AuthenticationError } from "../../lib/errors";

export async function requireAuth() {
  const sessionService = new SessionService();
  const user = await sessionService.getCurrentUser();
  
  if (!user) {
    throw new AuthenticationError("Authentication required.");
  }
  
  return user;
}
