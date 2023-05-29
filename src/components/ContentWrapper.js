import { useState, useEffect } from "react"
import Spinner from "./Spinner/"
import Content from "./Content"
import Cookies from "universal-cookie"
const cookies = new Cookies()

const ContentWrapper = () => {
	const [gettingToken, setGettingToken] = useState(true)
	const [token, setToken] = useState(cookies.get("token"))

	useEffect(() => {
		if (cookies.get("token") === undefined) {
			setTimeout(() => {
				setGettingToken(!gettingToken)
			}, 100)
		} else {
			setToken(cookies.get("token"))
		}
	}, [gettingToken])

	if (token === undefined) {
		return <Spinner />
	}

	return <Content />
}

export default ContentWrapper
