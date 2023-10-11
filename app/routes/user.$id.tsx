import { useParams } from "@remix-run/react"

export default function Index() {
    const {id} = useParams();

    return (<div>
        <h1>Username: {id}</h1>
    </div>)
}