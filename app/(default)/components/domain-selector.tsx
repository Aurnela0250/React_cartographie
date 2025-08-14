import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import { Label } from "@/presentation/components/ui/label";
import MultipleSelector from "@/presentation/components/ui/multiselect";
import {
    AuthenticationError,
    UnauthenticatedError,
} from "@/src/entities/errors/auth";

async function getDomainsForSelector() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const getDomainsController = getInjection("IGetDomainsController");

        const result = await getDomainsController(accessToken, {
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

export async function DomainSelector() {
    let domainsSelector: { value: string; label: string }[] = [];

    try {
        domainsSelector = await getDomainsForSelector();
    } catch (error) {
        throw error;
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="domain-selector">Domaines d'études</Label>
            <MultipleSelector
                commandProps={{
                    label: "Sélectionner des domaines",
                }}
                defaultOptions={domainsSelector}
                placeholder={"Sélectionner des domaines"}
                emptyIndicator={
                    <p className="text-center text-sm">Aucun domaine trouvé</p>
                }
                // onChange={onSelectionChange}
            />
        </div>
    );
}
