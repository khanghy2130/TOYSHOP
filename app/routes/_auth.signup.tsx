import { Link, Form } from "@remix-run/react";

export default function Signup(){
    return <div className="flex flex-col items-start">
        <h1>Create new account</h1>
        <Form action="/events" method="post">
            <div className="flex flex-col">

                <label htmlFor="email_input">Email</label>
                <input id="email_input" type="email" autoComplete="email"/>
                <label htmlFor="password_input">Password</label>
                <input id="password_input" type="password" autoComplete="new-password" />
                <label htmlFor="confirm_password_input">Confirm password</label>
                <input id="confirm_password_input" type="password" autoComplete="new-password"/>

                <button type="submit" className='btn'>Sign up</button>
            </div>
        </Form>

        <Link to="/login">
            <button className="underline">Already have an account?</button>
        </Link>

        {/* OR login providers */}
    </div>
}