import { getInjection } from "@/di/container";
import { Label } from "@/presentation/components/ui/label";
import MultipleSelector from "@/presentation/components/ui/multiselect";
import { AuthenticationError, UnauthenticatedError } from "@/src/entities/errors/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getLevelsForSelector() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const getLevelsController = getInjection("IGetLevelsController");

        const result = await getLevelsController(accessToken, {
            params: {
                perPage: 100,
                page: 1,
            },
        });

        const { items } = result;

        return items.map((city) => ({
            value: city.id?.toString() || "",
            label: city.name || "",
        }));
    } catch (error) {
        if (
            error instanceof UnauthenticatedError ||
            error instanceof AuthenticationError
        ) {
            redirect("/login");
        }
        throw error;
    }
}

export async function LevelSelector() {
    let levelsSelector: { value: string; label: string }[] = [];

    try {
        levelsSelector = await getLevelsForSelector();
    } catch (error) {
        throw error;
    }
    return (
        <div className="space-y-2">
            <Label htmlFor="level-selector">Niveaux d'études</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des niveaux d'études",
                }}
                defaultOptions={levelsSelector}
                placeholder={"Sélectionner des niveaux d'études"}
                emptyIndicator={
                    <p className="text-center text-sm">Aucun niveau trouvé</p>
                }
                // onChange={}
            />
        </div>
    );
}
