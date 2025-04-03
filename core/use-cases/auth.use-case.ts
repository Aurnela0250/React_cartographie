import { AuthRepository } from "@/infrastructure/repositories/auth.repository";
import { login, UserLogged } from "@/presentation/schemas/auth.schema";
import { NotFoundError } from "@/shared/errors/errors";

export class AuthUseCase {
    constructor(private authRepository: AuthRepository) {}

    async login({ email, password }: login): Promise<UserLogged> {
        try {
            return this.authRepository.login({ email, password });
        } catch (error) {
            if (error instanceof NotFoundError)
                throw new NotFoundError(error.message);

            throw error;
        }
    }
}
