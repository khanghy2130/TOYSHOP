import { Form } from "@remix-run/react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

/*
    when create/update, for each tag: if not already connected to the product then connect
*/

type ImageFile = {
    listKey: number;
    isAlreadyUploaded: boolean;
    willBeRemoved: boolean; // remove in db
    file: File;
};

export default function ProductDetails(props: { mode: "CREATE" | "UPDATE" }) {
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
        const files = (e.target as HTMLInputElement).files;
        if (files) {
            const newImageFiles: ImageFile[] = [];
            for (const file of files) {
                newImageFiles.push({
                    listKey: Math.floor(Math.random() * 10000),
                    isAlreadyUploaded: !false,
                    willBeRemoved: false,
                    file: file,
                });
            }
            setImageFiles([...imageFiles, ...newImageFiles]);
        }
    }
    function removeImage(listKey: number) {
        setImageFiles(
            imageFiles.filter((imageFile) => {
                // set willBeRemoved if isAlreadyUploaded
                if (imageFile.listKey === listKey) {
                    if (imageFile.isAlreadyUploaded) {
                        imageFile.willBeRemoved = true;
                        return true;
                    }
                    return false;
                }
                return true;
            }),
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(props.mode);
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
                                <img
                                    className="w-80"
                                    src={URL.createObjectURL(imageFile.file)}
                                />
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
                required
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
