let userConfig = undefined;

try {
    userConfig = await import("./v0-user-next.config");
} catch (e) {
    // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ["pages", "utils"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        parallelServerBuildTraces: true,
        parallelServerCompiles: true,
    },
    // Ignorer le dossier packages lors de la compilation
    transpilePackages: [],
    webpack: (config, { isServer }) => {
        // Ignorer les fichiers dans packages/session-auth
        config.watchOptions = {
            ...config.watchOptions,
            ignored: [
                ...(config.watchOptions?.ignored || []),
                "**/packages/**",
            ],
        };

        return config;
    },
    // turbo: {
    //     root: process.cwd(),
    //     rules: {
    //         // Exclure le dossier /packages/** ainsi que node_modules de la compilation Turbopack
    //         "**/*.{js,ts,jsx,tsx}": {
    //             // exclude: ["**/packages/**", "**/node_modules/**"],
    //         },
    //     },
    // },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
    if (!userConfig) {
        return;
    }

    for (const key in userConfig) {
        if (
            typeof nextConfig[key] === "object" &&
            !Array.isArray(nextConfig[key])
        ) {
            nextConfig[key] = {
                ...nextConfig[key],
                ...userConfig[key],
            };
        } else {
            nextConfig[key] = userConfig[key];
        }
    }
}

export default nextConfig;
