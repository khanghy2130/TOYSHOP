import { useEffect, useMemo, useState } from "react";
import * as bigSmile from "@dicebear/big-smile";
import { createAvatar } from "@dicebear/core";
import { AvatarOptions } from "~/utils/types/AvatarOptions";

import SpinnerSVG from "~/components/SpinnerSVG";

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

    // samples is dictionary of lists of {uri: string, applyToOptions: Function}
    const samples: {
        [key: string]: { uri: string; applyToOptions: Function }[];
    } = useMemo(() => {
        const hair: AvatarOptions["hair"] = [
            "shortHair",
            "mohawk",
            "wavyBob",
            "bowlCutHair",
            "curlyBob",
            "straightHair",
            "braids",
            "shavedHead",
            "bunHair",
            "froBun",
            "bangs",
            "halfShavedHead",
            "curlyShortHair",
        ];
        const eyes: AvatarOptions["eyes"] = [
            "cheery",
            "normal",
            "confused",
            "starstruck",
            "winking",
            "sleepy",
            "sad",
            "angry",
        ];
        const mouth: AvatarOptions["mouth"] = [
            "openedSmile",
            "unimpressed",
            "gapSmile",
            "openSad",
            "teethSmile",
            "awkwardSmile",
            "braces",
            "kawaii",
        ];
        const accessories: AvatarOptions["accessories"] = [
            "catEars",
            "glasses",
            "sailormoonCrown",
            "clownNose",
            "sleepMask",
            "sunglasses",
            "faceMask",
            "mustache",
        ];

        const result = {
            hair: hair.map((itemName) => {
                return {
                    uri: createAvatar(bigSmile, {
                        hair: [itemName],
                    }).toDataUri(),
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            hair: [itemName],
                        });
                    },
                };
            }),
            eyes: eyes.map((itemName) => {
                return {
                    uri: createAvatar(bigSmile, {
                        eyes: [itemName],
                    }).toDataUri(),
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            eyes: [itemName],
                        });
                    },
                };
            }),
            mouth: mouth.map((itemName) => {
                return {
                    uri: createAvatar(bigSmile, {
                        mouth: [itemName],
                    }).toDataUri(),
                    applyToOptions: function () {
                        setAvatarOptions({
                            ...avatarOptions,
                            mouth: [itemName],
                        });
                    },
                };
            }),
            accessories: accessories.map((itemName) => {
                return {
                    uri: createAvatar(bigSmile, {
                        accessoriesProbability: 100,
                        accessories: [itemName],
                    }).toDataUri(),
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
    }, []);

    // update avatar preview when options change
    useEffect(() => {
        if (avatarOptions === null) return;
        setAvatarUri(createAvatar(bigSmile, avatarOptions).toDataUri());
        console.log("update preview");
    }, [avatarOptions]);

    const saveAvatar: React.DOMAttributes<HTMLButtonElement>["onClick"] =
        async function (event) {
            console.log("save avatar clicked");
        };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="h-3/4 w-11/12 max-w-[800px] overflow-y-scroll bg-color-1">
                <h1>Avatar customization</h1>

                <div className="flex h-40 w-40 items-center justify-center">
                    {avatarUri === "" ? (
                        <div className="h-1/3 w-1/3">
                            <SpinnerSVG />
                        </div>
                    ) : (
                        <img className="h-full w-full" src={avatarUri} />
                    )}
                </div>

                <div>
                    <h2>Hair</h2>
                    <div className="flex flex-wrap">
                        {samples.hair.map((item, i) => (
                            <img className="h-20 w-20" src={item.uri} key={i} />
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Eyes</h2>
                    <div className="flex flex-wrap">
                        {samples.eyes.map((item, i) => (
                            <img className="h-20 w-20" src={item.uri} key={i} />
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Mouth</h2>
                    <div className="flex flex-wrap">
                        {samples.mouth.map((item, i) => (
                            <img className="h-20 w-20" src={item.uri} key={i} />
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Accessories</h2>
                    <div className="flex flex-wrap">
                        {samples.accessories.map((item, i) => (
                            <img className="h-20 w-20" src={item.uri} key={i} />
                        ))}
                    </div>
                </div>

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
