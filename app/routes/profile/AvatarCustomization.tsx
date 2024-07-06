import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import * as bigSmile from "@dicebear/big-smile";
import { createAvatar } from "@dicebear/core";
import { AvatarOptions } from "~/utils/types/AvatarOptions";

import SpinnerSVG from "~/components/SpinnerSVG";
import { hair, eyes, mouth, accessories } from "./AvatarOptions";

type Props = {
    setEnableAvatarCustomization: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AvatarCustomization({
    setEnableAvatarCustomization,
}: Props) {
    const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(
        null,
    );
    const [avatarUri, setAvatarUri] = useState<string>("");

    //// fetch avatar options from db
    useEffect(() => {
        setAvatarOptions({
            accessoriesProbability: 100,
            backgroundColor: ["013b31"],
            skinColor: ["e2ba87"],
            hairColor: ["943404"],
            hair: ["shortHair"],
            eyes: ["winking"],
            mouth: ["openedSmile"],
            accessories: ["glasses"],
        });
    }, []);

    // update avatar preview when options change
    useEffect(() => {
        if (avatarOptions === null) return;
        setAvatarUri(createAvatar(bigSmile, avatarOptions).toDataUri());
        console.log(avatarOptions);
    }, [avatarOptions]);

    // memorized images uri
    const optionImageURIs: { [key: string]: string[] } = useMemo(
        () => ({
            hair: hair!.map((itemName) => {
                return createAvatar(bigSmile, {
                    hair: [itemName],
                }).toDataUri();
            }),
            eyes: eyes!.map((itemName) => {
                return createAvatar(bigSmile, {
                    hair: ["shavedHead"],
                    eyes: [itemName],
                }).toDataUri();
            }),
            mouth: mouth!.map((itemName) => {
                return createAvatar(bigSmile, {
                    hair: ["shavedHead"],
                    mouth: [itemName],
                }).toDataUri();
            }),
            accessories: accessories!.map((itemName) => {
                return createAvatar(bigSmile, {
                    hair: ["shavedHead"],
                    accessoriesProbability: 100,
                    accessories: [itemName],
                }).toDataUri();
            }),
        }),
        [],
    );

    const optionSamples: {
        [key: string]: {
            uri: string;
            applyToOptions: MouseEventHandler<HTMLButtonElement>;
        }[];
    } = useMemo(() => {
        const result = {
            hair: hair!.map((itemName, itemIndex) => {
                return {
                    uri: optionImageURIs.hair[itemIndex],
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            hair: [itemName],
                        });
                    },
                };
            }),
            eyes: eyes!.map((itemName, itemIndex) => {
                return {
                    uri: optionImageURIs.eyes[itemIndex],
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            eyes: [itemName],
                        });
                    },
                };
            }),
            mouth: mouth!.map((itemName, itemIndex) => {
                return {
                    uri: optionImageURIs.mouth[itemIndex],
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            mouth: [itemName],
                        });
                    },
                };
            }),
            accessories: accessories!.map((itemName, itemIndex) => {
                return {
                    uri: optionImageURIs.accessories[itemIndex],
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            accessoriesProbability: 100,
                            accessories: [itemName],
                        });
                    },
                };
            }),
        };

        // add special option "none" to accessories category
        result.accessories.unshift({
            uri: createAvatar(bigSmile, {
                hair: ["shavedHead"],
                accessoriesProbability: 0,
            }).toDataUri(),
            applyToOptions: function () {
                setAvatarOptions({
                    ...avatarOptions,
                    accessoriesProbability: 0,
                });
            },
        });

        return result;
    }, [avatarOptions]);

    const saveAvatar: React.DOMAttributes<HTMLButtonElement>["onClick"] =
        async function (event) {
            console.log("save avatar clicked");
        };

    const customizeOptions: [
        string,
        (typeof optionSamples)[keyof typeof optionSamples],
    ][] = [
        ["Hair", optionSamples.hair],
        ["Eyes", optionSamples.eyes],
        ["Mouth", optionSamples.mouth],
        ["Accessories", optionSamples.accessories],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="h-3/4 w-11/12 max-w-[800px] overflow-y-scroll bg-color-1">
                <h1>Avatar customization</h1>

                <div className="flex h-52 w-52 items-center justify-center">
                    {avatarUri === "" ? (
                        <div className="h-1/3 w-1/3">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <img className="h-full w-full" src={avatarUri} />
                    )}
                </div>

                {
                    // render option samples
                    customizeOptions.map(([category, list], categoryIndex) => (
                        <div key={categoryIndex}>
                            <h2>{category}</h2>
                            <div className="flex flex-wrap">
                                {list.map((item, itemIndex) => (
                                    <button
                                        key={itemIndex}
                                        className="btn m-2 !p-0"
                                        onClick={item.applyToOptions}
                                    >
                                        <img
                                            className="h-20 w-20"
                                            src={item.uri}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                }

                <button
                    className="btn"
                    onClick={() => setEnableAvatarCustomization(false)}
                >
                    Cancel
                </button>
                <button className="btn" onClick={saveAvatar}>
                    Save
                </button>
            </div>
        </div>
    );
}
