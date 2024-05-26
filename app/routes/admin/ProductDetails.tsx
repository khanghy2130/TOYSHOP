import { Form } from "@remix-run/react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { ContextProps } from "~/utils/types/ContextProps.type";

type ImageFile = {
    listKey: number; // simple random number
    isFromDB: boolean;
    willBeRemoved: boolean; // remove in db
    url: string;
};

export default function ProductDetails(props: {
    mode: "CREATE" | "UPDATE";
    supabase: ContextProps["supabase"];
}) {
    const [tags, setTags] = useState<string[]>(["dummy", "weeboo", "yeye"]);
    const tagInput = useRef<HTMLInputElement>(null);

    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const imageFileInput = useRef<HTMLInputElement>(null);

    function addTag() {
        if (tagInput.current) {
            let newTag = tagInput.current.value;
            newTag = newTag.replace(/\s+/g, "");
            if (newTag.length > 0 && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            tagInput.current.value = "";
        }
    }
    function removeTag(tagIndex: number) {
        setTags(tags.filter((tag, i) => i !== tagIndex));
    }

    function onImageFileSelected(e: ChangeEvent<HTMLInputElement>) {
        const inputEle = e.target as HTMLInputElement;
        const files = inputEle.files;
        if (files) {
            const newImageFiles: ImageFile[] = [];
            for (const file of files) {
                newImageFiles.push({
                    listKey: Math.floor(Math.random() * 1000000),
                    isFromDB: !false,
                    willBeRemoved: false,
                    url: URL.createObjectURL(file),
                });
            }
            setImageFiles([...imageFiles, ...newImageFiles]);
            inputEle.value = "";
        }
    }
    function removeImage(listKey: number) {
        setImageFiles(
            imageFiles.filter((imageFile) => {
                // set willBeRemoved if isFromDB
                if (imageFile.listKey === listKey) {
                    if (imageFile.isFromDB) {
                        imageFile.willBeRemoved = true;
                        return true;
                    }
                    return false;
                }
                return true;
            }),
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formEle = event.target as HTMLFormElement;
        const formData = new FormData(formEle);
        let productID: number;

        if (props.mode === "CREATE") {
            // insert into PRODUCTS table
            const { data, error } = await props.supabase
                .from("PRODUCTS")
                .insert({
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    quantity: Number(formData.get("quantity")),
                })
                .select()
                .single();

            // handle error
            if (error) {
                console.error("Error while creating product:", error);
                return;
            }

            productID = data.id;
        } else if (props.mode === "UPDATE") {
            // update PRODUCT table ///
            // handle error
            // if (error) {
            //     console.error("Error while updating product:", error);
            //     return;
            // }
            // delete all old tag relations
            // const { error } = await props.supabase
            //     .from('PRODUCT_TAGS')
            //     .delete()
            //     .eq('product_id', xxx)
            /////// productID = ???
        }

        // ADD TAG RELATIONS (4 steps)
        // Step 1: Check existing tags
        let { data: existingTags, error: fetchError } = await props.supabase
            .from("TAGS")
            .select()
            .in("name", tags);
        if (!existingTags || fetchError) {
            console.error("Error fetching existing tags:", fetchError);
            return;
        }

        // Map existing tags { name: id }
        const existingTagMap = new Map(
            existingTags.map((tagItem) => [tagItem.name, tagItem.id]),
        );

        // Step 2: Identify non-existing tags to insert
        const newTags = tags.filter((tagName) => !existingTagMap.has(tagName));
        if (newTags.length > 0) {
            let { data: insertedTags, error: insertError } =
                await props.supabase
                    .from("TAGS")
                    .insert(newTags.map((tagName) => ({ name: tagName })))
                    .select();
            if (!insertedTags || insertError) {
                console.error("Error inserting new tags:", insertError);
                return;
            }

            // Add new tags to the map
            for (const tagItem of insertedTags) {
                existingTagMap.set(tagItem.name, tagItem.id);
            }
        }

        // Step 3: Prepare post-tag relations
        const postTags = tags.map((tagName) => ({
            product_id: productID,
            tag_id: existingTagMap.get(tagName),
        }));

        // Step 4: Insert post-tag relations
        let { error: relationError } = await props.supabase
            .from("PRODUCTS_TAGS")
            .insert(postTags);

        if (relationError) {
            console.error("Error inserting post-tag relations:", relationError);
            return;
        }

        /*
            for each image:
                if isFromDB: do nothing unless willBeRemoved then remove
                else: upload image
        */

        // all actions successful
        // formEle.reset();
        // window.location.reload();
    }

    return (
        <Form
            className="flex w-full max-w-3xl flex-col"
            onSubmit={handleSubmit}
        >
            <input
                className="mb-10 bg-color-3 p-2"
                type="text"
                required
                placeholder="Title"
                name="title"
            />
            <textarea
                className="mb-10 bg-color-3 p-2"
                required
                placeholder="Description"
                name="description"
            />
            <input
                className="mb-10 bg-color-3 p-2"
                type="number"
                min={0}
                required
                placeholder="Quantity"
                name="quantity"
            />

            <div>
                {tags.map((tag, i) => (
                    <div className="flex" key={tag}>
                        <p className="rounded-lg border-2 border-solid border-color-2 p-1">
                            {tag}
                        </p>
                        <button
                            className="text-red-500 underline"
                            type="button"
                            onClick={() => removeTag(i)}
                        >
                            delete
                        </button>
                    </div>
                ))}
            </div>
            <div>
                <input
                    className="mb-10 bg-color-3 p-2"
                    type="text"
                    placeholder="Tag name"
                    ref={tagInput}
                    onKeyDown={(e) => {
                        // hit enter to add tag
                        if (e.key == "Enter") {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                />
                <button className="btn" type="button" onClick={addTag}>
                    Add tag
                </button>
            </div>

            <div>
                {
                    // hide the ones that will be removed
                    imageFiles
                        .filter((imageFile) => !imageFile.willBeRemoved)
                        .map((imageFile, i) => (
                            <div className="flex" key={imageFile.listKey}>
                                <img className="w-80" src={imageFile.url} />
                                <button
                                    className="text-red-500 underline"
                                    type="button"
                                    onClick={() =>
                                        removeImage(imageFile.listKey)
                                    }
                                >
                                    delete
                                </button>
                            </div>
                        ))
                }
            </div>
            <input
                type="file"
                multiple
                accept="image/png, image/jpeg"
                ref={imageFileInput}
                onChange={onImageFileSelected}
            />

            <button className="btn" type="submit">
                {props.mode === "CREATE" ? "Create product" : null}
                {props.mode === "UPDATE" ? "Update product" : null}
            </button>
        </Form>
    );
}
