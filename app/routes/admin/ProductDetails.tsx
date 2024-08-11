import { Form, useNavigate } from "@remix-run/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { ContextProps } from "~/utils/types/ContextProps.type";
import { UpdateFormState } from ".";

type ImageFile = {
    listKey: number; // simple random number
    willBeRemoved: boolean; // remove in db
    file: null | File; // null if is already uploaded to DB
    name: string;
    url: string;
};

type Props = {
    mode: "CREATE" | "UPDATE";
    supabase: ContextProps["supabase"];
    updateFormState: UpdateFormState;
    SUPABASE_IMAGES_PATH: string;
};

export default function ProductDetails({
    mode,
    supabase,
    updateFormState,
    SUPABASE_IMAGES_PATH,
}: Props) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [tags, setTags] = useState<string[]>([]);
    const tagInput = useRef<HTMLInputElement>(null);

    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const imageFileInput = useRef<HTMLInputElement>(null);

    // when loading existing product
    useEffect(() => {
        setTags(updateFormState.tags); // add existing tags
        // add existing images
        const newImageFiles: ImageFile[] = [];
        for (const imgName of updateFormState.imgNames) {
            newImageFiles.push({
                listKey: Math.floor(Math.random() * 1000000),
                willBeRemoved: false,
                file: null,
                name: `${updateFormState.productID}/${imgName}`,
                url: `${SUPABASE_IMAGES_PATH}/${updateFormState.productID}/${imgName}`,
            });
        }
        setImageFiles(newImageFiles);
    }, [updateFormState]);

    function addTag() {
        if (tagInput.current) {
            let newTag = tagInput.current.value.toLocaleLowerCase();
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

    function addImages(e: ChangeEvent<HTMLInputElement>) {
        const inputEle = e.target as HTMLInputElement;
        const files = inputEle.files;
        if (files) {
            const newImageFiles: ImageFile[] = [];
            for (const file of files) {
                newImageFiles.push({
                    listKey: Math.floor(Math.random() * 1000000),
                    willBeRemoved: false,
                    file: file,
                    name: file.name,
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
                // set willBeRemoved if is from DB
                if (imageFile.listKey === listKey) {
                    if (imageFile.file === null) {
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
        setIsSubmitting(true);
        const formEle = event.target as HTMLFormElement;
        const formData = new FormData(formEle);
        let productID: number = updateFormState.productID;

        if (mode === "CREATE") {
            // insert into PRODUCTS table
            const { data, error } = await supabase
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
                console.error("Error creating product", error);
                return setIsSubmitting(false);
            }

            productID = data.id;
        } else if (mode === "UPDATE") {
            const { error: updateError } = await supabase
                .from("PRODUCTS")
                .update({
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    quantity: Number(formData.get("quantity")),
                })
                .eq("id", productID);

            if (updateError) {
                console.error("Error updating product", updateError);
                return setIsSubmitting(false);
            }

            // delete all old tag relations
            const { error: deleteTagsError } = await supabase
                .from("PRODUCTS_TAGS")
                .delete()
                .eq("product_id", productID);

            if (deleteTagsError) {
                console.error("Error deleting old tags", deleteTagsError);
                return setIsSubmitting(false);
            }
        }

        // ADD TAG RELATIONS (4 steps)
        // Step 1: Check existing tags
        let { data: existingTags, error: fetchError } = await supabase
            .from("TAGS")
            .select()
            .in("name", tags);
        if (fetchError) {
            console.error("Error fetching existing tags", fetchError);
            return setIsSubmitting(false);
        }

        // Map existing tags { name: id }
        const existingTagMap = new Map(
            existingTags!.map((tagItem) => [tagItem.name, tagItem.id]),
        );

        // Step 2: Identify non-existing tags to insert
        const newTags = tags.filter((tagName) => !existingTagMap.has(tagName));
        if (newTags.length > 0) {
            let { data: insertedTags, error: insertError } = await supabase
                .from("TAGS")
                .insert(newTags.map((tagName) => ({ name: tagName })))
                .select();
            if (insertError) {
                console.error("Error inserting new tags", insertError);
                return setIsSubmitting(false);
            }

            // Add new tags to the map
            for (const tagItem of insertedTags!) {
                existingTagMap.set(tagItem.name, tagItem.id);
            }
        }

        // Step 3: Prepare post-tag relations
        const postTags = tags.map((tagName) => ({
            product_id: productID,
            tag_id: existingTagMap.get(tagName),
        }));

        // Step 4: Insert post-tag relations
        let { error: relationError } = await supabase
            .from("PRODUCTS_TAGS")
            .insert(postTags);

        if (relationError) {
            console.error("Error inserting post-tag relations", relationError);
            return setIsSubmitting(false);
        }

        // remove images from DB
        const toBeRemovedImages = imageFiles.filter(
            (imgFile) => imgFile.willBeRemoved,
        );
        if (toBeRemovedImages.length > 0) {
            const { error: removeImagesError } = await supabase.storage
                .from("product_images")
                .remove(toBeRemovedImages.map((imgFile) => imgFile.name));
            if (removeImagesError) {
                console.error("Error removing images", removeImagesError);
                return setIsSubmitting(false);
            }
        }

        // upload images to DB
        for (const imgFile of imageFiles) {
            if (imgFile.file) {
                // upload new image
                const { data, error } = await supabase.storage
                    .from("product_images")
                    .upload(`${productID}/${Date.now()}`, imgFile.file);
                if (error) {
                    console.error("Error uploading image", error);
                    return setIsSubmitting(false);
                }
            }
        }

        // all actions successful
        formEle.reset();
        setIsSubmitting(false);
        return navigate("/product/" + productID);
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
                defaultValue={updateFormState.title}
            />
            <textarea
                className="mb-10 bg-color-3 p-2"
                required
                placeholder="Description"
                name="description"
                defaultValue={updateFormState.description}
            />
            <input
                className="mb-10 bg-color-3 p-2"
                type="number"
                min={0}
                required
                placeholder="Quantity"
                name="quantity"
                defaultValue={updateFormState.quantity}
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
                onChange={addImages}
            />

            <button className="btn" type="submit" disabled={isSubmitting}>
                {isSubmitting
                    ? "Processing..."
                    : mode === "CREATE"
                      ? "Create product"
                      : mode === "UPDATE"
                        ? "Update product"
                        : null}
            </button>
        </Form>
    );
}
