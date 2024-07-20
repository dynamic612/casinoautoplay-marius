import useAuth from 'hooks/useAuth';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
const Dice = () => {
  const [amount, setAmount] = useState(0);
  const [upDown, setUpDown] = useState('RollUnder');
  const [buttonColor1, setButtonColor1] = useState('bg-sky-600');
  const [buttonColor2, setButtonColor2] = useState('bg-gray-300');
  const [dividing, setDividingPoint] = useState(0);
  const [playNumber, setPlayNumber] = useState(1);
  const socketRef = useRef(null);
  const [playData, setPlayData] = useState([]);
  const playNumberRef = useRef(1);
  const userIdRef = useRef('');
  const amountRef = useRef(0);
  const dividingRef = useRef(0);
  const upDownRef = useRef('RollUnder');
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const balanceRef = useRef(0);
  const userTokenRef = useRef('');
  useEffect(() => {
    playNumberRef.current = playNumber;
    userIdRef.current = user.userId;
    amountRef.current = amount;
    dividingRef.current = dividing;
    upDownRef.current = upDown;
    balanceRef.current = balance;
    userTokenRef.current = user.authToken;
  }, [playNumber, amount, dividing, upDown, balance]);

  let username = '';
  let counter = 0;
  function handleChangeAmount(event) {
    setAmount(event.target.value);
  }
  function handleChangeDividingPoint(event) {
    setDividingPoint(event.target.value);
  }
  function handleChangePlayNumber(event) {
    setPlayNumber(parseInt(event.target.value));
  }
  function handleChangeUpdown(status) {
    if (status === 'up') {
      setUpDown('RollUnder');
      setButtonColor1('bg-sky-600');
      setButtonColor2('bg-gray-300');
    } else if (status === 'down') {
      setUpDown('RollOver');
      setButtonColor1('bg-gray-300');
      setButtonColor2('bg-sky-600');
    }
  }

  const betStart = async () => {
    setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({
          id: '0d7d8090-9791-11ee-b9d1-0242ac120002',
          payload: {
            query:
              '{\n  authenticate(\n    authToken: \n"' +
              userTokenRef.current +
              '"\n  ) {\n    _id\n    username\n    authToken\n    email\n    twoFactorEnabled\n    role\n    countryBlock\n    __typename\n  }\n}',
            variables: {}
          },
          type: 'subscribe'
        })
      );
    }, 1000);

    setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({
          id: 'b37aeb93-b24a-41c4-8ac6-c8a496d99f88',
          payload: {
            query:
              'mutation ($amount: Float!, $clientSeed: String!, $dividingPoint: Float!, $mode: DiceGameMode!) {\n  playDice(\n    amount: $amount\n    clientSeed: $clientSeed\n    dividingPoint: $dividingPoint\n    mode: $mode\n  ) {\n    id\n    isWin\n    profit\n    details {\n      ... on DiceGameDetails {\n        __typename\n        result\n        dividingPoint\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on TowerGameDetails {\n        __typename\n      }\n      ... on HiloGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
              dividingPoint: parseInt(dividingRef.current),
              mode: upDownRef.current,
              amount: parseInt(amountRef.current),
              clientSeed: userIdRef.current
            }
          },
          type: 'subscribe'
        })
      );
    }, 2000);
  };
  const handlePlay = async () => {
    if (amount === 0) {
      toast('Please input Amount', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    } else if (dividing === 0) {
      toast('Please input Dividing', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    } else if (userTokenRef.current === '') {
      toast('Please input userToken', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    } else {
      counter = 0;
      betStart();
    }
  };

  const getbalence = async () => {
    socketRef.current.send(
      JSON.stringify({
        id: 'f454cbb6-d074-470d-9aa4-835dc10904a4',
        payload: {
          query: 'subscription {\n  balance {\n    before\n    after\n  }\n}',
          variables: {}
        },
        type: 'subscribe'
      })
    );
  };

  const autoPlay = () => {
    setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({
          id: 'b37aeb93-b24a-41c4-8ac6-c8a496d99f88',
          payload: {
            query:
              'mutation ($amount: Float!, $clientSeed: String!, $dividingPoint: Float!, $mode: DiceGameMode!) {\n  playDice(\n    amount: $amount\n    clientSeed: $clientSeed\n    dividingPoint: $dividingPoint\n    mode: $mode\n  ) {\n    id\n    isWin\n    profit\n    details {\n      ... on DiceGameDetails {\n        __typename\n        result\n        dividingPoint\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on TowerGameDetails {\n        __typename\n      }\n      ... on HiloGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
              dividingPoint: parseInt(dividingRef.current),
              mode: upDownRef.current,
              amount: parseInt(amountRef.current),
              clientSeed: userIdRef.current
            }
          },
          type: 'subscribe'
        })
      );
    }, 500);
  };
  const stop = () => {
    socketRef.current.close();
  };
  // let socket;

  useEffect(() => {
    const connectWebSocket = () => {
      socketRef.current = new WebSocket('wss://bch.games/api/graphql', 'graphql-transport-ws');

      socketRef.current.onopen = () => {
        // Once the WebSocket connection is open, you can send your GraphQL request
        socketRef.current.send(JSON.stringify({ type: 'connection_init' }));
      };

      socketRef.current.onmessage = (event) => {
        // Handle incoming messages from the WebSocket server
        const response = JSON.parse(event.data);
        if (response.id === '0d7d8090-9791-11ee-b9d1-0242ac120002' && response.payload) {
          username = response.payload.data.authenticate.username;
          getbalence();
        } else if (response.id === 'b37aeb93-b24a-41c4-8ac6-c8a496d99f88' && response.payload) {
          if (response.payload.errors && response.payload.errors[0].message === 'INSUFFICIENT_FUNDS_ERROR')
            toast('Not enough BCH', { hideProgressBar: false, autoClose: 2000, type: 'error' });
          else if (response.payload.data.playDice) {
            setPlayData((prevPlayData) => [...prevPlayData, { username: username, data: response.payload.data.playDice }]);
            if (counter < playNumberRef.current) {
              autoPlay();
              counter++;
            }
          }
        } else if (response.id == 'f454cbb6-d074-470d-9aa4-835dc10904a4') {
          if (response.payload.data.balance) {
            setBalance(response.payload.data.balance.after);
          }
        } else {
          console.log('response =>', response.id);
        }
      };
    };
    connectWebSocket();

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      if (socketRef.current.readyState === WebSocket.CLOSED) {
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
      } // Reconnect after 1 second
    };
    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-screen">
      <div className="inline-flex w-full mb-5">
        <div className="flex items-center mr-[58px]">
          <div className="text-[20px]">Amount</div>
        </div>
        <input
          className="items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100"
          onChange={handleChangeAmount}
        ></input>
      </div>

      <div className="inline-flex w-full mb-5">
        <button
          className={`rounded-full ${buttonColor1} hover:bg-gray-500 ml-3`}
          onClick={() => {
            handleChangeUpdown('up');
          }}
        >
          <div className="mx-[20px]">UP</div>
        </button>
        <button
          className={`rounded-full ${buttonColor2} hover:bg-gray-500 ml-3`}
          onClick={() => {
            handleChangeUpdown('down');
          }}
        >
          <div className="mx-[20px]">Down</div>
        </button>
      </div>

      <div className="inline-flex w-full mb-5">
        <div className="flex items-center mr-[28px]">
          <div className="text-[20px]">Play Number</div>
        </div>
        <input
          className="items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100"
          onChange={handleChangePlayNumber}
        ></input>
      </div>

      <div className="inline-flex w-full mb-5">
        <div className="flex items-center mr-[20px]">
          <div className="text-[20px]">Dividing Point</div>
        </div>
        <input
          className="items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100"
          onChange={handleChangeDividingPoint}
        ></input>
        <button
          className={`rounded-full bg-gray-300 hover:bg-gray-500 ml-3`}
          onClick={() => {
            handlePlay();
          }}
        >
          <div className="mx-[20px]">Play</div>
        </button>
        <button
          className={`rounded-full bg-gray-300 hover:bg-gray-500 ml-3`}
          onClick={() => {
            stop();
          }}
        >
          <div className="mx-[20px]">Stop</div>
        </button>
      </div>

      <div className="inline-flex w-full mb-5">
        <div className="flex items-center mr-[20px]">
          <div className="text-[20px]">Balance:</div>
        </div>
        <div className="flex items-center mr-[20px]">
          <div className="text-[20px]">{balanceRef.current}</div>
        </div>
      </div>
      {playData.length != 0 ? (
        <>
          <div className="table text-[15px] max-w-xs w-full">
            <div className="table-header-group">
              <div className="table-row">
                <div className="table-cell text-left">No</div>
                <div className="table-cell text-left">User</div>
                <div className="table-cell text-left">Profit</div>
                <div className="table-cell text-left">Result</div>
              </div>
            </div>

            <div className="table-row-group">
              {playData.map((item, index) => (
                <div className="table-row" key={index}>
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{item.username}</div>
                  <div className="table-cell">{item.data.profit}</div>
                  <div className="table-cell">{item.data.details.result}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <ToastContainer />
    </div>
  );
};

export default Dice;
