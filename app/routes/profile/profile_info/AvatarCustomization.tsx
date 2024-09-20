import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import * as bigSmile from "@dicebear/big-smile";
import { createAvatar } from "@dicebear/core";
import { AvatarOptions } from "~/utils/types/AvatarOptions";

import SpinnerSVG from "~/components/SpinnerSVG";
import { hair, eyes, mouth, accessories } from "./AvatarOptions";
import { useOutletContext } from "@remix-run/react";
import { ContextProps } from "~/utils/types/ContextProps.type";

type Props = {
    setShowAvatarModal: SetState<boolean>;
    setAvatarUriTrigger: SetState<{}>;
};

export default function AvatarCustomization({
    setShowAvatarModal,
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
            setShowAvatarModal(false);
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
            <div className="flex h-5/6 w-11/12 max-w-[800px] flex-col rounded-lg border-2 border-textColor2 bg-bgColor1">
                {/* Modal header */}
                <div className="flex w-full flex-row border-b-2 border-textColor2">
                    <h1 className="px-4 py-2 text-xl">Customize avatar</h1>
                    <button
                        className="ml-auto mr-4 text-textColor1 hover:text-primaryColor"
                        onClick={() => setShowAvatarModal(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="relative flex w-full flex-grow flex-col overflow-hidden md:flex-row">
                    {/* Avatar */}
                    <div className="sticky flex flex-col items-start px-4 md:top-0 md:pt-20">
                        <div className="mx-auto my-2 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg md:h-52 md:w-52">
                            {avatarUri === "" ? (
                                <div className="h-1/3 w-1/3">
                                    <SpinnerSVG />
                                </div>
                            ) : (
                                <img
                                    className="h-full w-full"
                                    src={avatarUri}
                                />
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-grow flex-col overflow-y-auto px-2 md:mt-0">
                        {
                            // render option samples
                            customizeOptions.map(
                                ([category, list], categoryIndex) => (
                                    <div key={categoryIndex} className="mt-2">
                                        <h2 className="text-lg italic">
                                            {category}
                                        </h2>
                                        <div className="flex flex-wrap justify-center border-b-2 border-textColor2 pb-2">
                                            {list.map((item, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className="flex w-1/4 justify-center sm:w-1/5"
                                                >
                                                    <button
                                                        onClick={
                                                            item.applyToOptions
                                                        }
                                                        className="click-shrink rounded-md border-2 border-bgColor1 hover:border-primaryColor"
                                                    >
                                                        <img
                                                            className="h-20 w-20"
                                                            src={item.uri}
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ),
                            )
                        }

                        <h2 className="mt-2 text-lg italic">Colors</h2>
                        <div className="mt-2 flex justify-around">
                            <div className="flex flex-col items-center">
                                <input
                                    className="w-10 cursor-pointer bg-transparent sm:w-20"
                                    type="color"
                                    id="skin-color"
                                    value={"#" + avatarOptions?.skinColor}
                                    onChange={(e) => {
                                        setAvatarOptions({
                                            ...avatarOptions,
                                            skinColor: [
                                                e.currentTarget.value
                                                    .toString()
                                                    .substring(1),
                                            ],
                                        });
                                    }}
                                />
                                <label htmlFor="skin-color">Skin</label>
                            </div>

                            <div className="flex flex-col items-center">
                                <input
                                    className="w-10 cursor-pointer bg-transparent sm:w-20"
                                    type="color"
                                    id="hair-color"
                                    value={"#" + avatarOptions?.hairColor}
                                    onChange={(e) => {
                                        setAvatarOptions({
                                            ...avatarOptions,
                                            hairColor: [
                                                e.currentTarget.value
                                                    .toString()
                                                    .substring(1),
                                            ],
                                        });
                                    }}
                                />
                                <label htmlFor="hair-color">Hair</label>
                            </div>

                            <div className="flex flex-col items-center">
                                <input
                                    className="w-10 cursor-pointer bg-transparent sm:w-20"
                                    type="color"
                                    id="background-color"
                                    value={"#" + avatarOptions?.backgroundColor}
                                    onChange={(e) => {
                                        setAvatarOptions({
                                            ...avatarOptions,
                                            backgroundColor: [
                                                e.currentTarget.value
                                                    .toString()
                                                    .substring(1),
                                            ],
                                        });
                                    }}
                                />
                                <label htmlFor="background-color">
                                    Background
                                </label>
                            </div>
                        </div>

                        <button
                            className="click-shrink mx-3 mb-4 mt-6 self-end rounded-md bg-primaryColor px-4 py-1 text-lg font-medium text-primaryTextColor hover:bg-primaryColorMuted"
                            onClick={saveAvatar}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
