"use client"
import Image from "next/image"
import { useState, useEffect } from 'react'

export default function SetAIDemo() {
	const [availableTraits, setAvailableTraits] = useState<string[][]>([])
	const [currentTraits, setCurrentTraits] = useState<string[]>([])
	const [currentVariations, setCurrentVariations] = useState<string[]>([])
	const [isSelected, setIsSelected] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false, false, false])
	const [checkSelectedCardsBtnText, setCheckSelectedCardsBtnText] = useState("Check Selected Cards")
	const [isDisabled, setIsDisabled] = useState(false)
	const allVariations: {[key: string]: string[]} = {
		Color: ["Red", "Green", "Purple"],
		Shape: ["Circle", "Square", "Triangle"],
		Number: ["1", "2", "3"],
		Fill: ["Solid", "Striped", "Empty"]
	}
	const imageContext = require.context("/public/set", false, /\.(png)$/)
	const images = imageContext.keys()
	const cardVariations: string[][] = [
		["Green", "Triangle", "1", "Empty"],
		["Purple", "Triangle", "1", "Empty"],
		["Red", "Circle", "1", "Empty"],
		["Green", "Square", "1", "Striped"],
		["Purple", "Square", "1", "Striped"],
		["Green", "Square", "3", "Empty"],
		["Red", "Triangle", "3", "Empty"],
		["Green", "Circle", "3", "Solid"],
		["Green", "Square", "3", "Solid"],
		["Purple", "Square", "3", "Solid"],
		["Purple", "Triangle", "2", "Empty"],
		["Purple", "Square", "2", "Solid"],
	]

	useEffect(() => {
        const res: string[][] = [
			["Color", "Shape", "Number", "Fill"],
			["Color", "Shape", "Number", "Fill"],
			["Color", "Shape", "Number", "Fill"],
			["Color", "Shape", "Number", "Fill"]
		]
		for (let i = 0; i < currentTraits.length; i++) {
			for (let j = 0; j < 4; j ++) {
				if (i !== j && res[j].includes(currentTraits[i])) {
					res[j].splice(res[j].indexOf(currentTraits[i]), 1)
				}
			}
		}
		setAvailableTraits(res)
		setIsDisabled(currentTraits.length === 4)
	}, [currentTraits])

	function addTraitSelect() {
		setCurrentTraits(prev => [...prev, availableTraits[prev.length][0]])
		setCurrentVariations(prev => [...prev, allVariations[availableTraits[prev.length][0]][0]])
		setCheckSelectedCardsBtnText("Check Selected Cards")
	}

	function checkSelectedCards() {
		const count = isSelected.filter(x => x).length
		if (count > 3) {
			setCheckSelectedCardsBtnText("Too many cards selected!")
		} else if (count < 3) {
			setCheckSelectedCardsBtnText("Not enough cards selected!")
		} else if ((isSelected[0] && isSelected[6] && isSelected[10]) || (isSelected[2] && isSelected[5] && isSelected[10])) {
			setCheckSelectedCardsBtnText("SET found!")
		} else {
			setCheckSelectedCardsBtnText("Not a SET")
		}
	}

    function handleTraitChange(trait: string, i: number) {
		setCurrentTraits(prev => {
			const newTraits = [...prev]
			newTraits[i] = trait
			return newTraits
		})
		handleVariationChange(allVariations[trait][0], i)
		setCheckSelectedCardsBtnText("Check Selected Cards")
    }

	function handleVariationChange(variation: string, i: number) {
		setCurrentVariations(prev => {
			const newVariations = [...prev]
			newVariations[i] = variation
			return newVariations
		})
		setCheckSelectedCardsBtnText("Check Selected Cards")
	}

	function removeTraitSelect(i: number) {
		setCurrentTraits(prev => prev.toSpliced(i, 1))
		setCurrentVariations(prev => prev.toSpliced(i, 1))
		setCheckSelectedCardsBtnText("Check Selected Cards")
	}

	function shouldSelectCard(i: number) {
		for (const variation of currentVariations) {
			if (!cardVariations[i].includes(variation)) {
				return false
			}
		}
		return true
	}

	function updateCardSelection(i: number) {
		setIsSelected(prev => {
			const newSelections = [...prev]
			newSelections[i] = !newSelections[i]
			return newSelections
		})
		setCheckSelectedCardsBtnText("Check Selected Cards")
	}

	return (
		<div className="flex flex-col">
			<h3 className="text-center">There are 2 SETs in this board, can you find them?</h3>
			<div className="grid grid-cols-4 gap-4 grid-rows-3">
				{
					images.map((image, i) => (
						<Image
							key={i}
							src={'/set' + image.slice(1)}
							alt={image.slice(2)}
							className={`
								m-0 cursor-pointer shadow-sm shadow-black
								${currentVariations.length > 0 && shouldSelectCard(i) ?
									"border-blue-500 border-4" :
									null
								}
								${isSelected[i] ?
									"ring-4 ring-red-500" :
									null
								}
							`}
							onClick={() => updateCardSelection(i)}
						/>
					))
				}
			</div>
			<div className="flex flex-row justify-between mt-4">
				<button
					className={`p-4 text-xl rounded-xl max-h-[3.75rem] ${isDisabled ? "bg-gray-500 cursor-default" : "bg-blue-500 "}`}
					onClick={addTraitSelect}
					disabled={isDisabled}
				>
					Add Trait
				</button>
				<div className="flex flex-col min-h-[13rem]">
					{
						currentTraits.map((trait, i) => 
							<div key={`${trait}${i}`} className="flex flex-row justify-between">
								<select value={trait} onChange={event => handleTraitChange(event.target.value, i)} className="m-2 min-w-[5.25rem] cursor-pointer bg-transparent border-solid border-2 border-gray-500">
									{
										availableTraits[i].map((traits, j) =>
											<option key={`${traits}${j}`} className="text-gray-500">{traits}</option>
										)
									}
								</select>
								<select onChange={event => handleVariationChange(event.target.value, i)} className="m-2 min-w-[5.25rem] cursor-pointer bg-transparent border-solid border-2 border-gray-500">
									{
										allVariations[trait].map((variation, k) =>
											<option key={`${variation}${k}`} className="text-gray-500">{variation}</option>
										)
									}
								</select>
								<button onClick={() => removeTraitSelect(i)} className="m-2 bg-blue-500 rounded-lg text-md pl-2 pr-2">Remove Trait</button>
							</div>
						)
					}
				</div>
				<button onClick={checkSelectedCards} className="bg-red-500 p-4 text-xl rounded-xl max-h-[5.5rem] w-[11.25rem]">{checkSelectedCardsBtnText}</button>
			</div>
		</div>
	)
}