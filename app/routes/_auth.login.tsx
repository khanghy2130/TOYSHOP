import { Link, Form } from "@remix-run/react";


export const loader = () => {

    return {};
};

export default function Login(){
    return <div className="flex flex-col items-start">
        <h1>Login</h1>
        <Form action="/events" method="post">
            <div className="flex flex-col">

                <label htmlFor="email_input">Email</label>
                <input id="email_input" type="email" autoComplete="email"/>
                <label htmlFor="password_input">Password</label>
                <input id="password_input" type="password" autoComplete="current-password" />

                <button type="submit" className='btn'>Log In</button>
            </div>
        </Form>
        
        <button className="underline">Use demo account</button>
        <Link to="/signup">
            <button className="underline">Create new account</button>
        </Link>

        {/* OR login providers */}
    </div>
}