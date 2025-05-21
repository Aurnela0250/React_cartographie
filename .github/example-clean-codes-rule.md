### Code Examples

Below are examples of code that follow our project's standards and conventions:

#### Entity Example (`**.entity.ts`)

```typescript
export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
};
```

#### Container Example (`container.ts`)

```typescript
export class Container {
    private static instance: Container;

    // Repositories
     private userRepository: UserRepository;

    // Usecases
     private authUseCase: AuthUseCase;

    private constructor() {
        // Initialize Repositories
         this.userRepository = new UserRepository();
        // Initialize Usecases
         this.authUseCase = new AuthUseCase(this.userRepository);
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }

        return Container.instance;
    }

    // Repository getters
    public getUserRepository(): UserRepository {
        return this.userRepository;
    }

    // UseCase getters
    public getAuthUseCase(): AuthUseCase {
        return this.authUseCase;
    }
}
```

#### Interface Example (`**.interface.ts`)

```typescript
import { User, Client } from "../entities/user";

export interface IUserRepository {
  getUserByEmail(email: string): Promise;
  getUserByUsername(username: string): Promise;
  getUserById(id: string): Promise;
  createUser(
    userData: Pick
  ): Promise;
  createClient(
    clientData: Pick
  ): Promise;
}
```

#### Use Case Example (`**.use-case.ts`)

```typescript
import { UserRepository } from "@/src/infrastructure/repositories/user.repository";
import { User } from "../entities/user";
import { RegisterInput } from "@/src/presentation/schemas/auth.schema";
import { ConflictError, InternalServerError } from "@/src/utils/errors";
import { hashPassword } from "@/src/utils";

export class AuthUseCase {
  constructor(private userRepository: UserRepository) {}

  async login(login: string, password: string): Promise {
    // implementation ....
  }

  async register(userData: RegisterInput): Promise {
    try {
      const { email, password } = userData;

      // Create the username from the email
      const username = email.split("@")[0];

      // Check if the user already exists
      const existingUserByEmail = await this.userRepository.getUserByEmail(
        email
      );
      const existingUserByUsername =
        await this.userRepository.getUserByUsername(username);

      if (existingUserByEmail || existingUserByUsername) {
        throw new ConflictError(
          "A user with this email or username already exists"
        );
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create the user
      const newUser = await this.userRepository.createUser({
        email,
        username,
        password: hashedPassword,
      });

      const client = await this.userRepository.createClient({
        clientType: "NURSERY",
        userId: newUser.id,
      });

      newUser.client = client;

      return newUser;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new InternalServerError(
        "An unexpected error occurred during registration"
      );
    }
  }
}
```

#### Repository Example (`**.repository.ts`)

```typescript
import { Client, User } from "@/src/domain/entities/user";
import { IUserRepository } from "@/src/domain/interfaces/user.repository";
import { API_BASE_URL } from "@/src/config/constants";

export class UserRepository implements IUserRepository {
  private apiUrl = API_BASE_URL;

  // Mapper function to convert API response to User domain entity
  private to_user(userData: any): User {
    return {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      password: userData.password,
    };
  }

  async createUser(
    userData: Pick<User, "username" | "email" | "password">
  ): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const data = await response.json();
    return this.to_user(data);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const response = await fetch(`${this.apiUrl}/users/email/${email}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get user by email: ${response.statusText}`);
    }

    const data = await response.json();
    return this.to_user(data);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const response = await fetch(`${this.apiUrl}/users/username/${username}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get user by username: ${response.statusText}`);
    }

    const data = await response.json();
    return this.to_user(data);
  }

  async getUserById(id: string): Promise<User | null> {
    const response = await fetch(`${this.apiUrl}/users/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get user by id: ${response.statusText}`);
    }

    const data = await response.json();
    return this.to_user(data);
  }
}
```

#### Server Action Example (`**.action.ts`)

```typescript
"use server";

import { actionClient } from "@/src/infrastructure/services/safe-action";
import { registerSchema } from "@/src/presentation/schemas/auth.schema";
import { ConflictError } from "../../utils/errors";
import { Container } from "@/src/infrastructure/store/container";

export const register = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const container = Container.getInstance();
      const authUseCase = container.getAuthUseCase();

      await authUseCase.register(parsedInput);

      return { success: true };

      // throw new Error("Une erreur est survenue lors de la connexion");
    } catch (error) {
      if (error instanceof ConflictError)
        console.error("Action error:", error.message);
      throw error;
    }
  });
```
