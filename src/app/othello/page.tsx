"use client";

const test_board:number[] = [
    0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 1, -1, 0, 0, 0,
     0, 0, 0, -1, 1, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0,
]; // -1:黒,1:白

export default function othelloPage() {
    
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
        console.log(data)
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold m-4">オセロ</h1>
            <div className="grid grid-cols-8 gap-0.5 bg-black p-2 rounded-lg">
                {test_board.map((cell, idx) => (
                    <button
                        key={idx}
                        onClick={() => sendMove(idx)}
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