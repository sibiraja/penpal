import React, { useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import ContentWrapper from "./ContentWrapper"
import Cookies from "universal-cookie"

const cookies = new Cookies()
let AUDIENCE = process.env.REACT_APP_AUDIENCE

const Home = () => {
	const { isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } =
		useAuth0()

	useEffect(() => {
		// fixed approved token
		cookies.set(
			"token",
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJnbWttbHpDV1pHa0VTeEpydXRxWCJ9.eyJodHRwczovL2V4YW1wbGUuY29tL2VtYWlsIjoia2hvaW5ndXllbjEyMzEyMDAwQGdtYWlsLmNvbSIsImh0dHBzOi8vZGVsaWxhaC5jb2xsZWdlL2VtYWlsIjoia2hvaW5ndXllbjEyMzEyMDAwQGdtYWlsLmNvbSIsImh0dHBzOi8vZGVsaWxhaC5jb2xsZWdlL2VtYWlsdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LXl5dzV6c3V3MmpwNDBxMXgudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE2OTUxODE4NjQ3NTI2NzY1MjMyIiwiYXVkIjpbImh0dHBzOi8vZGVsaWxhaC1iYWNrZW5kL2FwaSIsImh0dHBzOi8vZGV2LXl5dzV6c3V3MmpwNDBxMXgudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3Njc2Mzk4MiwiZXhwIjoxNjc2ODUwMzgyLCJhenAiOiJxdVp1enFBeDFDNndBejhZdTdpZVR2NzJsTUJVeTFhcSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.jHTLCGQIUojud_UFX2W8NZTz-kJMPACNe_yunxJkUFzsApMiyrH1jytGmQkNmXuFoPTX6iwdUQJ0LXMRWZbYMRRQFfcSqV_fGeLWzZ-KOEQARSzkwXCi9OXszoqs_WZsGCdmRvqm1duLEA5IrmoYXI_N9rQ2iF_q1FDdGX562k8PA-LuVnwExukrPUvoWE4SLk_Ti4ORpuGHpQA4l_6ZZWufZ3kVOhQD-51mI9nML9HvvTknyCAxdNpZZM78iUxYy_fX2WyuToxRqI5ZluLL07WPrXeJkM2rRfowOI_Mh4y2iMa-ecTf1TJoYl8_ft4EL2k7_aBYY6Kivtv5oLUvpg",
			{ path: "/" }
		)
		if (isAuthenticated) {
			getAccessTokenSilently({
				audience: AUDIENCE,
				scope: "read:current_user",
			})
				.then((res) => {
					cookies.set("token", res, { path: "/" })
				})
				.catch((error) => {
					getAccessTokenWithPopup({
						audience: AUDIENCE,
						scope: "read:current_user",
					})
						.then((res) => {
							cookies.set("token", res, { path: "/" })
						})
						.catch((error) => {
							console.log("error", error)
						})
				})
		}
	}, [isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup])

	return <ContentWrapper />
}

export default Home
