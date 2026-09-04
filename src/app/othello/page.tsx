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

type GameState = {
    board: number[],
    actions: number[],
    turn: number
}

// スリープ関数 (ミリ秒)
const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

// 盤面の取得
async function getBoard() {
    const response = await fetch("http://127.0.0.1:8000/board",{
        method: "GET",
    })
    const data = await response.json()

    return [data.board, data.next_actions]
}

export default function OthelloPage() {

    const [state, setState] = useState<GameState>({board: [], actions: [], turn: -1}) // 盤面の管理
    const [isProcessing, setIsProcessing] = useState<boolean>(false) // バックエンド処理中フラグ

    // クリックされたマスが合法手か確認
    const checkMove = async(idx:number) => {
        if (state.actions.includes(idx) && !isProcessing) {
            sendMove(idx)
        }
    }
    
    // クリックされたマスに石を置く
    const sendMove = async(idx:number) => {
        // console.log(idx)
        setIsProcessing(true)
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
        // console.log(data.boards)

        for(let i = 0; i < data.boards.length; i++) {
            setState({board: data.boards[i], actions: data.next_actions[i], turn: data.turns[i]})
            if(i != data.boards.length-1) await sleep(2000)
        }
        setIsProcessing(false)
        // setBoard(data.boards[0])
    }

    // リセット機能
    const restart = async() => {
        const response = await fetch("http://127.0.0.1:8000/reset",{
            method: "POST",
        })
        await response.json()
        const [initial_board, next_actions, turns] = await getBoard()
        setState({board: initial_board, actions: next_actions, turn: turns})
        setIsProcessing(false)
    }

    // 初期化
    useEffect(() => {
        async function loadBoard() {
            const [initial_board, next_actions, turns] = await getBoard()
            setState({board: initial_board, actions: next_actions, turn: turns})
        }
        loadBoard()
    }, [])

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold m-4">オセロ</h1>
            <button onClick={() => restart()}
                        className={`border rounded flex items-center justify-center text-2xl font-bold shadow-sm bg-gray-400 mb-2`}>リスタート</button>
            <div className="grid grid-cols-8 gap-0.5 bg-black p-2 rounded-lg">
                {state.board.map((cell, idx) => (
                    <button
                        key={idx}
                        onClick={() => checkMove(idx)}
                        className={`w-20 h-20 bg-green-600 border rounded flex items-center justify-center text-8xl font-bold shadow-sm transition-colors`}
                    >
                    {renderStoneAndCandidate(cell, idx, state.actions, state.turn)}
                    </button>
                ))}
            </div>
        </div>
    );
}

// 石&候補手
function renderStoneAndCandidate(cell:number, idx:number, actions:number[], turn:number = -1) {
  if (cell === 1) {
    return <div className="w-12 h-12 rounded-full bg-white"></div>
  } else if (cell === -1) {
    return <div className="w-12 h-12 rounded-full bg-black"></div>
  } else {
    if (actions.includes(idx)) {
        if (turn === 1) {
            return <div className="w-3 h-3 rounded-full bg-white opacity-50"></div>
        } else if (turn === -1) {
            return <div className="w-3 h-3 rounded-full bg-black opacity-50"></div>
        } else {
            return null
        }
    } else {
        return null
    }
  }
}