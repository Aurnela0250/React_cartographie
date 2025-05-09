import { User } from "@/core/domain/entities/users.entity";
import { IUserRepository } from "@/core/domain/interfaces/users.repository.interface";
import { AuthenticationError, NotFoundError } from "@/shared/errors/errors";

export class UserRepository implements IUserRepository {
    createUser(data: { email: string; password: string }): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const response = await fetch(`${process.env.INTERNAL_API_URL}/user`, {
            body: JSON.stringify({ email }),
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 400) throw new NotFoundError("Utilisateur");
            if (response.status === 401) throw new AuthenticationError();
        }

        const data = await response.json();

        const user: User = {
            email: data.email,
            id: data.id,
            name: data.name,
        };

        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        const response = await fetch(
            `${process.env.INTERNAL_API_URL}/users/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            if (response.status === 400) throw new NotFoundError("Utilisateur");
            if (response.status === 401) throw new AuthenticationError();
        }

        const data = await response.json();

        const user: User = {
            email: data.email,
            id: data.id,
            name: data.name,
        };

        return user;
    }
}
