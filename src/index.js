import App from "./App"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Auth0Provider } from "@auth0/auth0-react"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<BrowserRouter>
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			redirectUri={process.env.REACT_APP_REDIRECT_URI}
			audience={process.env.REACT_APP_AUDIENCE}
			scope='read:current_user'
			useRefreshTokens={true}
			cacheLocation='localstorage'
		>
			<App />
		</Auth0Provider>
	</BrowserRouter>
)
