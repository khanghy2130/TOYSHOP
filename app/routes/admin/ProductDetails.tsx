import { Form } from "@remix-run/react";
import { FormEvent, useRef, useState } from "react";

/*
    when create/update, for each tag: if not already connected to the product then connect
*/

export default function ProductDetails(props: { mode: "CREATE" | "UPDATE" }) {
    const [tags, setTags] = useState<string[]>(["dummy", "weeboo", "yeye"]);
    const tagInput = useRef<HTMLInputElement>(null);

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
                    <div className="flex" key={i}>
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

            <input required type="file" multiple />
            <div>images preview here?</div>
            <button className="btn" type="submit">
                {props.mode === "CREATE" ? "Create product" : null}
                {props.mode === "UPDATE" ? "Update product" : null}
            </button>
        </Form>
    );
}
