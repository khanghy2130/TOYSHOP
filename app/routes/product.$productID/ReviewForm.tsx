import { FormEvent, useState } from "react";
import { ProductInfo } from "./Types";
import { Form } from "@remix-run/react";

type Props = { productInfo: ProductInfo };

export default function ReviewForm({ productInfo }: Props) {
    const [enableFormInput, setEnableFormInput] = useState<boolean>(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    async function deleteReview() {}

    async function enableEdit() {
        setEnableFormInput(true);
    }

    return (
        <Form
            className="flex w-full max-w-3xl flex-col"
            onSubmit={handleSubmit}
        >
            {!enableFormInput ? (
                <div>
                    <button className="btn" type="button" onClick={enableEdit}>
                        Edit review
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={deleteReview}
                    >
                        Delete review
                    </button>
                </div>
            ) : null}

            <p>rating selection (can be disabled), undecided on how</p>

            <textarea
                className="bg-color-3 p-2"
                required
                placeholder="Feedback"
                name="feedback"
                disabled={!enableFormInput}
                defaultValue={".....value........"}
            />

            {enableFormInput ? (
                <button className="btn" type="submit">
                    Submit review
                </button>
            ) : null}
        </Form>
    );
}
