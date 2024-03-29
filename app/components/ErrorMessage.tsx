// General Error Message.

type Props = {
    errorMessage: string | null;
};

export default function ErrorMessage({
    props: { errorMessage },
}: {
    props: Props;
}) {
    return (
        <em className="mb-2 block text-center font-semibold text-color-4">
            {errorMessage}
        </em>
    );
}
