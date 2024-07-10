import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import * as bigSmile from "@dicebear/big-smile";
import { createAvatar } from "@dicebear/core";
import { AvatarOptions } from "~/utils/types/AvatarOptions";

import SpinnerSVG from "~/components/SpinnerSVG";
import { hair, eyes, mouth, accessories } from "./AvatarOptions";
import { useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    setEnableAvatarCustomization: React.Dispatch<React.SetStateAction<boolean>>;
    setAvatarUriTrigger: React.Dispatch<React.SetStateAction<{}>>;
};

export default function AvatarCustomization({
    setEnableAvatarCustomization,
    setAvatarUriTrigger,
}: Props) {
    const { supabase, user } = useOutletContext<ContextProps>();

    const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(
        null,
    );
    const [avatarUri, setAvatarUri] = useState<string>("");

    // fetch avatar options from db
    useEffect(() => {
        (async function () {
            if (!user) return;
            const { data, error } = await supabase
                .from("AVATARS")
                .select(`*`)
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching avatar");
                return;
            }

            setAvatarOptions({
                accessoriesProbability: data.accessoriesProbability!,
                backgroundColor: [data.backgroundColor!],
                skinColor: [data.skinColor!],
                hairColor: [data.hairColor!],
                hair: [data.hair!] as AvatarOptions["hair"],
                eyes: [data.eyes!] as AvatarOptions["eyes"],
                mouth: [data.mouth!] as AvatarOptions["mouth"],
                accessories: [
                    data.accessories!,
                ] as AvatarOptions["accessories"],
            });
        })();
    }, []);

    // update avatar preview when options change
    useEffect(() => {
        if (avatarOptions === null) return;
        setAvatarUri(createAvatar(bigSmile, avatarOptions).toDataUri());
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
    } = {
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
    optionSamples.accessories.unshift({
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

    const saveAvatar: React.DOMAttributes<HTMLButtonElement>["onClick"] =
        async function (event) {
            const { error } = await supabase
                .from("AVATARS")
                .update({
                    accessoriesProbability:
                        avatarOptions!.accessoriesProbability,
                    backgroundColor: avatarOptions!.backgroundColor![0],
                    skinColor: avatarOptions!.skinColor![0],
                    hairColor: avatarOptions!.hairColor![0],
                    hair: avatarOptions!.hair![0],
                    eyes: avatarOptions!.eyes![0],
                    mouth: avatarOptions!.mouth![0],
                    accessories: avatarOptions!.accessories![0],
                })
                .eq("id", user!.id);
            if (error) {
                console.error("Error update avatar", error);
                return;
            }

            // successfully updated
            setAvatarUriTrigger({});
            setEnableAvatarCustomization(false);
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

                <h2>Skin color</h2>
                <input
                    type="color"
                    value={"#" + avatarOptions?.skinColor}
                    onChange={(e) => {
                        setAvatarOptions({
                            ...avatarOptions,
                            skinColor: [
                                e.currentTarget.value.toString().substring(1),
                            ],
                        });
                    }}
                />

                <h2>Hair color</h2>
                <input
                    type="color"
                    value={"#" + avatarOptions?.hairColor}
                    onChange={(e) => {
                        setAvatarOptions({
                            ...avatarOptions,
                            hairColor: [
                                e.currentTarget.value.toString().substring(1),
                            ],
                        });
                    }}
                />

                <h2>Background color</h2>
                <input
                    type="color"
                    value={"#" + avatarOptions?.backgroundColor}
                    onChange={(e) => {
                        setAvatarOptions({
                            ...avatarOptions,
                            backgroundColor: [
                                e.currentTarget.value.toString().substring(1),
                            ],
                        });
                    }}
                />

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
