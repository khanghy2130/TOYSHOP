
export default function Login(){
    return <div className="flex flex-col">
        <h1>Login</h1>

        <label htmlFor="email_input">Email</label>
        <input id="email_input" type="email" />
        <label htmlFor="password_input">Password</label>
        <input id="password_input" type="password" />

        <button>Continue</button>
    </div>
}