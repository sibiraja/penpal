import React, { useEffect, useState } from "react"
import Spinner from "./Spinner"
import Request from "./Request"
import FreeWrite from "./FreeWrite"
import Cookies from "universal-cookie"
import { useAuth0 } from "@auth0/auth0-react"

const cookies = new Cookies()

const Content = () => {
	const [threads, setThreads] = useState([])
	const [selectedThread, setSelectedThread] = useState("")

	// freewrite mode
	const [freewriteThreads, setFreewriteThreads] = useState([])
	const [selectedFreewriteThread, setSelectedFreewriteThread] = useState("")

	// websocket connection
	const [socket, setSocket] = useState(null)
	const [reconnectSocket, setReconnectSocket] = useState(false)

	useEffect(() => {
		if (cookies.get("token") === undefined) {
			console.log("Cookies: ", cookies.getAll())
			setTimeout(() => {}, 1000)
		}

		initData()

		setSocket(
			new WebSocket(
				process.env.REACT_APP_WS_URL +
					"ws/essay/" +
					"?token=" +
					cookies.get("token")
			)
		)
		setReconnectSocket(!reconnectSocket)
	}, [])

	useEffect(() => {
		if (socket === null) return
		socket.onopen = (e) => {
			console.log("Connected to websocket from home")
		}

		socket.onclose = (e) => {
			console.log("Disconnected from websocket from home because: ", e)
			setTimeout(() => {
				setSocket(connectToSocket())
				setReconnectSocket(!reconnectSocket)
			}, 1000)
		}

		socket.onerror = (e) => {
			console.log("Error connecting to websocket from home")
			socket.close()
		}

		return () => {
			socket.close()
		}
	}, [reconnectSocket])

	const connectToSocket = () => {
		const newWS = new WebSocket(
			process.env.REACT_APP_WS_URL +
				"ws/essay/" +
				"?token=" +
				cookies.get("token")
		)
		return newWS
	}

	// something random with initializing breaking the loading
	const initData = () => {
		const threadsRequest = new Request("threads/")
		threadsRequest
			.then((res) => {
				setThreads(res.data)
				setSelectedThread(res.data[0].id)
			})
			.catch((err) => {
				console.log(err)
			})

		const freewriteThreadsRequest = new Request("freewritethreads/")
		freewriteThreadsRequest
			.then((res) => {
				setFreewriteThreads(res.data)
				setSelectedFreewriteThread(res.data[0].id)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	if (selectedThread === "") {
		return <Spinner />
	}

	return (
		<div className="flex flex-row from-green-200 to-green-500 bg-gradient-135">
			<FreeWrite
				freewriteThreads={freewriteThreads}
				setFreewriteThreads={setFreewriteThreads}
				selectedFreewriteThread={selectedFreewriteThread}
				setSelectedFreewriteThread={setSelectedFreewriteThread}
				socket={socket}
			/>
		</div>
	)
}

export default Content
