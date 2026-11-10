# JWT (access + refresh) instead of server-side sessions

A signed-in User is represented by a short-lived access JWT in an httpOnly cookie plus a refresh token stored in the database and rotated on use. A plain server-side session would be simpler and easier to revoke for an app this size; we chose JWT anyway because the purpose of this repo is to learn how JWT auth works, including its costs (revocation, rotation). The Google sign-in flow itself is written by hand rather than through an auth library for the same reason.
