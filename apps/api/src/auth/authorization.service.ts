import { ForbiddenException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthenticatedUser } from "./current-user.type";

@Injectable()
export class AuthorizationService {
    isAdmin(user: AuthenticatedUser) {
        return user.role === Role.ADMIN;
    }

    canAccessOwnerResource(user: AuthenticatedUser, ownerId: number) {
        return this.isAdmin(user) || user.id === ownerId;
    }

    ensureOwnerResourceAccess(
        user: AuthenticatedUser,
        ownerId: number,
        message = 'You are not allowed to access this resource.',
    ) {
        if (!this.canAccessOwnerResource(user, ownerId)) {
            throw new ForbiddenException(message);
        }
    }
}