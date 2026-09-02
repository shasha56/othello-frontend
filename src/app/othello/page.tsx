"use client";
import {useState, useEffect} from "react";

// const test_board:number[] = [
//     0, 0, 0, 0, 0, 0, 0, 0,
//      0, 0, 0, 0, 0, 0, 0, 0,
//      0, 0, 0, 0, 0, 0, 0, 0,
//      0, 0, 0, 1, -1, 0, 0, 0,
//      0, 0, 0, -1, 1, 0, 0, 0,
//      0, 0, 0, 0, 0, 0, 0, 0,
//      0, 0, 0, 0, 0, 0, 0, 0,
//      0, 0, 0, 0, 0, 0, 0, 0,
// ]; // -1:黒,1:白

// スリープ関数 (ミリ秒)
const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

// 盤面の取得
async function getBoard() {
    const response = await fetch("http://127.0.0.1:8000/board",{
        method: "GET",
    })
    const data = await response.json()


    return data.board
}

export default function OthelloPage() {

    const [board, setBoard] = useState<number[]>([]) // 盤面の管理

    // クリックされたマスが合法手か確認
    const checkMove = async(idx:number) => {
        const response = await fetch("http://127.0.0.1:8000/check",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: idx,
            }),
        })
        const data = await response.json()

        if (data.status) {
            sendMove(idx)
        }
    }
    
    // クリックされたマスに石を置く
    const sendMove = async(idx:number) => {
        console.log(idx)
        const response = await fetch("http://127.0.0.1:8000/move",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: idx,
            }),
        })
        const data = await response.json()
        console.log(data.boards)

        for(let i = 0; i < data.boards.length; i++) {
            setBoard(data.boards[i])
            await sleep(3000)
        }
        // setBoard(data.boards[0])
    }

    // 初期化
    useEffect(() => {
        async function loadBoard() {
            const initial_board = await getBoard()
            setBoard(initial_board)
        }

        loadBoard()
    }, [])

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold m-4">オセロ</h1>
            <div className="grid grid-cols-8 gap-0.5 bg-black p-2 rounded-lg">
                {board.map((cell, idx) => (
                    <button
                        key={idx}
                        onClick={() => checkMove(idx)}
                        className={`w-20 h-20 bg-green-600 border rounded flex items-center justify-center text-8xl font-bold shadow-sm transition-colors`}
                    >
                    {renderStone(cell)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function renderStone(cell:number) {
  if (cell == 1) {
    return <div className="w-12 h-12 rounded-full bg-white"></div>
  } else if (cell == -1) {
    return <div className="w-12 h-12 rounded-full bg-black"></div>
  } else {
    return null
  }
}