import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
    email: string;
    image?: string | null;
};

function UserAvatar({ email, image }: UserAvatarProps) {
    const avatarUri = `https://api.dicebear.com/9.x/thumbs/svg?seed=${email}`;

    const finalImage = image ?? avatarUri;

    return (
        <Avatar className="size-8">
            <AvatarImage alt="avatar" src={finalImage} />
            <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}

export default UserAvatar;
