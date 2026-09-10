"use client";
import {useState, useEffect} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL

type GameState = {
    status: string,
    board: number[],
    actions: number[],
    turn: number,
    black_stones: number,
    white_stones: number
}

// スリープ関数 (ミリ秒)
const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

// 盤面の取得
async function getBoard() {
    const response = await fetch(`${API_URL}/board`,{
        method: "GET",
    })
    const data = await response.json()

    return [data.board, data.next_actions, data.turns, data.stone_count[0][0], data.stone_count[0][1]]
}

export default function OthelloPage() {

    const [state, setState] = useState<GameState>({status: "", board: [], actions: [], turn: -1, black_stones: 2, white_stones: 2}) // 盤面の管理
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
        const response = await fetch(`${API_URL}/move`,{
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
            setState({status: data.status, board: data.boards[i], actions: data.next_actions[i], turn: data.turns[i], black_stones: data.stone_count[i][0], white_stones: data.stone_count[i][1]})
            if(i != data.boards.length-1) await sleep(2000)
        }
        setIsProcessing(false)
        // setBoard(data.boards[0])
    }

    // リセット機能
    const restart = async() => {
        const response = await fetch(`${API_URL}/reset`,{
            method: "POST",
        })
        await response.json()
        const [initial_board, next_actions, turns, black_stones, white_stones] = await getBoard()
        setState({status: "next", board: initial_board, actions: next_actions, turn: turns, black_stones: black_stones, white_stones: white_stones})
        setIsProcessing(false)
    }

    // 初期化
    useEffect(() => {
        async function loadBoard() {
            const [initial_board, next_actions, turns, black_stones, white_stones] = await getBoard()
            setState({status: "next", board: initial_board, actions: next_actions, turn: turns, black_stones: black_stones, white_stones: white_stones})
        }
        loadBoard()
    }, [])

    //ゲーム進行の表示
    function message(status: string, turn: number) {
        if (isProcessing) {
            return "AI思考中..."
        } else {
            switch(status) {
                case "black":
                    return "黒の勝利"
                case "white":
                    return "白の勝利"
                case "draw":
                    return "引き分け"
                case "next":
                    if (turn == 1) {
                        return "白の番です"
                    } else if (turn == -1) {
                        return "黒の番です"
                    } else {
                        return "手番が不明です"
                    }
                case "pass":
                    return "打つところがありません"
                default:
                    return "該当なし"
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
            <h1 className="text-5xl font-bold mb-6">オセロ</h1>
            <button onClick={() => restart()}
                        className="px-5 py-2 mb-4 rounded-lg bg-gray-700 text-white text-lg font-bold shadow hover:bg-gray-600 transition">リスタート</button>
            <div className="text-2xl font-bold mb-4">{message(state.status, state.turn)}</div>
            <div className="grid grid-cols-8 gap-1 bg-gray-900 p-2 rounded-xl shadow-lg">
                {state.board.map((cell, idx) => (
                    <button
                        key={idx}
                        onClick={() => checkMove(idx)}
                        className="w-16 h-16 bg-green-600 border border-green-800 flex items-center justify-center transition hover:bg-green-500"
                    >
                    {renderStoneAndCandidate(cell, idx, state.actions, state.turn)}
                    </button>
                ))}
            </div>
            <div className="mt-5 text-2xl font-bold">{`黒: ${state.black_stones} 白: ${state.white_stones}`}</div>
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