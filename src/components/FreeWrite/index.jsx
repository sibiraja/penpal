import React, { useState, useEffect, useRef } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import "./style.css"
import Request from "../Request"
import FreeWriteMenu from "./FreewriteMenu"
import PromptInput from "./PromptInput"

const FreeWrite = ({
	freewriteThreads,
	setFreewriteThreads,
	selectedFreewriteThread,
	socket,
}) => {
	const [text, setText] = useState(
		freewriteThreads.find(
			(freewriteThread) => freewriteThread.id === selectedFreewriteThread
		).text
	)
	const [prompt, setPrompt] = useState(
		freewriteThreads.find(
			(freewriteThread) => freewriteThread.id === selectedFreewriteThread
		).prompt
	)
	const [bounds, setBounds] = useState(null)
	const [showMenu, setShowMenu] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isGenerating, setIsGenerating] = useState(false)
	const quillRef = useRef(null)

	useEffect(() => {
		if (socket === null) return

		socket.onmessage = (e) => {
			const data = JSON.parse(e.data)
			const editor = quillRef.current.getEditor()

			if (data["first_output"]) {
				setIsGenerating(true)
				const selection = editor.getSelection(true)
				editor.deleteText(selection.index, selection.length)
			}

			if (data["output_text"]) {
				editor.insertText(
					editor.getSelection(true).index,
					data["output_text"]
				)
			}

			if (data["status"] === "DONE") {
				setIsGenerating(false)
			}
		}

		return () => {
			socket.onmessage = null
		}
	}, [socket])

	useEffect(() => {
		setText(
			freewriteThreads.find(
				(freewriteThread) =>
					freewriteThread.id === selectedFreewriteThread
			).text
		)
		setPrompt(
			freewriteThreads.find(
				(freewriteThread) =>
					freewriteThread.id === selectedFreewriteThread
			).prompt
		)
	}, [selectedFreewriteThread])

	useEffect(() => {
		const parameters = {
			data: {
				text: text,
			},
			method: "POST",
		}
		const updateTextRequest = new Request(
			"freewritethreads/" + selectedFreewriteThread + "/settext/",
			parameters
		)
		setIsSaving(true)

		updateTextRequest
			.then((res) => {
				const newFreewriteThreads = freewriteThreads.map(
					(freewriteThread) => {
						if (freewriteThread.id === selectedFreewriteThread) {
							freewriteThread.text = text
						}
						return freewriteThread
					}
				)
				setFreewriteThreads(newFreewriteThreads)
				setIsSaving(false)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [text])

	// set the background of the snow theme
	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
		],
	}

	const handleChangeSelection = (e) => {
		if (!e || e.length === 0 || e.length < 10) {
			setShowMenu(false)
			return
		}

		const selectedText = window.getSelection().toString()
		if (!selectedText) {
			setShowMenu(false)
			return
		}

		const editor = quillRef.current.getEditor()
		const selectionBounds = editor.getBounds(e.index, e.length)
		setBounds(selectionBounds)
		setShowMenu(true)
	}

	const handleContextMenu = (e, mode) => {
		e.preventDefault()

		socket.send(
			JSON.stringify({
				input_text: window.getSelection().toString(),
				mode: mode,
				websocket_type: "freewritesnippet",
				freewrite_thread_id: selectedFreewriteThread,
			})
		)
	}

	const updatePrompt = (prompt) => {
		const parameters = {
			method: "POST",
			data: {
				prompt: prompt,
			},
		}

		const promptRequest = new Request(
			"freewritethreads/" + selectedFreewriteThread + "/setprompt/",
			parameters
		)

		promptRequest
			.then((res) => {
				const newFreewriteThreads = freewriteThreads.map(
					(freewriteThread) => {
						if (freewriteThread.id === selectedFreewriteThread) {
							freewriteThread.prompt = prompt
						}
						return freewriteThread
					}
				)
				setFreewriteThreads(newFreewriteThreads)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className="w-screen overflow-y-scroll overflow-x-hidden flex flex-col h-screen px-[10rem] py-[2rem] ">
			<div className="relative">
				<PromptInput
					prompt={prompt}
					setPrompt={setPrompt}
					updatePrompt={updatePrompt}
				/>
				<ReactQuill
					theme="snow"
					className="w-full h-full"
					value={text}
					onChange={setText}
					modules={modules}
					onChangeSelection={(e) => handleChangeSelection(e)}
					ref={quillRef}
					readOnly={isGenerating}
				/>

				<FreeWriteMenu
					bounds={bounds}
					showMenu={showMenu}
					handleContextMenu={handleContextMenu}
				/>
			</div>

			<div className=" absolute bottom-0 right-0 mr-[2rem] mb-[2rem]">
				Built with ❤️ by Khoi Nguyen, Artemas Radik, and Sibi Raja
			</div>
		</div>
	)
}

export default FreeWrite
