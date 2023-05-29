const FreeWriteMenu = ({ showMenu, bounds, handleContextMenu }) => {
	const menuOption = ({ mode, text }) => {
		return (
			<div
				className="p-2 text-sm font-medium w-full hover:cursor-pointer hover:bg-treehacksPrimary/50 flex flex-row text-[#475467]"
				onMouseDown={(e) => handleContextMenu(e, mode)}
			>
				<p className="ml-2 ">{text}</p>
			</div>
		)
	}

	return (
		<div
			className={
				"flex flex-col bg-[#FFFFFF] rounded absolute space-x-1 text-black items-center justify-center border border-slate-200" +
				(showMenu ? "" : " hidden")
			}
			style={
				bounds
					? {
							top: bounds.top + 220,
							left: bounds.left,
							minWidth: 100,
							maxWidth: 200,
					  }
					: {}
			}
		>
			<p className="font-normal text-xs text-left text-slate-500 mt-2 self-start ml-2">
				Options
			</p>
			{menuOption({
				mode: "flowery",
				text: "Elaborate",
			})}
			{menuOption({
				mode: "summarize",
				text: "Summarize",
			})}
		</div>
	)
}

export default FreeWriteMenu
