// src/infrastructure/store/container.ts

import { AuthUseCase } from "@/core/use-cases/auth.use-case";

import { AuthRepository } from "../repositories/auth.repository";

// Importez d'autres repositories et usecases

export class Container {
    private static instance: Container;

    // Repositories
    // private userRepository: UserRepository;
    private authRepository: AuthRepository;

    // Usecases
    // private authUseCase: AuthUseCase;
    private authUseCase: AuthUseCase;

    private constructor() {
        // Initialize Repositories
        // this.userRepository = new UserRepository();
        this.authRepository = new AuthRepository();
        // Initialize Usecases
        this.authUseCase = new AuthUseCase(this.authRepository);
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }

        return Container.instance;
    }

    // Repository getters
    public getAuthRepository(): AuthRepository {
        return this.authRepository;
    }

    // UseCase getters
    public getAuthUseCase(): AuthUseCase {
        return this.authUseCase;
    }
}
