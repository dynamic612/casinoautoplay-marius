import React, { useState, useEffect, useRef } from 'react';
import useAuth from 'hooks/useAuth';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Tower = () => {
  const [amount, setAmount] = useState(0);
  const [playNumber, setPlayNumber] = useState(1);
  const [difficulty, setDifficulty] = useState('Hard');
  const [buttonColor1, setButtonColor1] = useState('bg-sky-600');
  const [buttonColor2, setButtonColor2] = useState('bg-gray-300');
  const [buttonColor3, setButtonColor3] = useState('bg-gray-300');
  const [stepLimit, setStepLimit] = useState(0);
  const socketRef = useRef(null);
  const { user } = useAuth();
  const [playData, setPlayData] = useState([]);
  let username = '';
  let playId = '';
  let counter = 0;
  const playNumberRef = useRef(1);
  const userIdRef = useRef('');
  const amountRef = useRef(0);
  const userToken = user.authToken;
  const [balance, setBalance] = useState(0);
  const balanceRef = useRef(0);
  const stepLimitRef = useRef(0);
  const difficultyRef = useRef('Hard');
  let step = 0;
  function handleChangeHard(status) {
    if (status === 'Hard') {
      setDifficulty('Hard');
      setButtonColor1('bg-sky-600');
      setButtonColor2('bg-gray-300');
      setButtonColor3('bg-gray-300');
    } else if (status === 'Medium') {
      setDifficulty('Medium');
      setButtonColor1('bg-gray-300');
      setButtonColor2('bg-sky-600');
      setButtonColor3('bg-gray-300');
    } else if (status === 'Easy') {
      setDifficulty('Easy');
      setButtonColor1('bg-gray-300');
      setButtonColor3('bg-sky-600');
      setButtonColor2('bg-gray-300');
    }
  }
  function handleChangeAmount(event) {
    setAmount(event.target.value);
  }
  function handleChangePlayNumber(event) {
    setPlayNumber(parseInt(event.target.value));
  }
  function handleChangeStepLimit(event) {
    setStepLimit(parseInt(event.target.value));
  }
  const handlePlay = async () => {
    if (amount === 0) {
      toast('Please input Amount', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    } else if (userToken === '') {
      toast('Please input userToken', { hideProgressBar: false, autoClose: 2000, type: 'error' });
    } else {
      counter = 0;
      if (socketRef.current) {
        setTimeout(() => {
          socketRef.current.send(
            JSON.stringify({
              id: '2302f5fa-98c0-11ee-b9d1-0242ac120002',
              payload: {
                query:
                  '{\n  authenticate(\n    authToken: \n"' +
                  userToken +
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
              id: '134fa1dd-86c9-4bd4-ae31-2b8d0db16d98',
              payload: {
                query:
                  'mutation ($amount: Float!, $autoCashout: Boolean, $clientSeed: String!, $difficulty: TowerDifficulty!, $tilesToUncover: [Int!]) {\n  playTower(\n    amount: $amount\n    autoCashout: $autoCashout\n    clientSeed: $clientSeed\n    difficulty: $difficulty\n    tilesToUncover: $tilesToUncover\n  ) {\n    __typename\n    ... on SinglePlayerGameBet {\n      id\n      isWin\n      multiplier\n      profit\n      amount\n      details {\n        ... on TowerGameDetails {\n          __typename\n          difficulty\n          levels\n          levelsCount\n          uncovered\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on HiloGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on SinglePlayerGameBetInProgress {\n      _id\n      amount\n      details {\n        ... on TowerGameDetails {\n          __typename\n          difficulty\n          levels\n          levelsCount\n          uncovered\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on HiloGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}',
                variables: { difficulty: difficulty, amount: parseInt(amount), clientSeed: userIdRef.current }
              },
              type: 'subscribe'
            })
          );
        }, 2000);
      }
    }
  };

  const autoPlay = (data) => {
    console.log('step-------->', step);
    socketRef.current.send(
      JSON.stringify({
        id: '9dafaba2-98c7-11ee-b9d1-0242ac120002',
        payload: {
          query:
            'mutation ($_id: ID!, $tilesToUncover: [Int!]!) {\n  towerSelectTiles(_id: $_id, tilesToUncover: $tilesToUncover) {\n    __typename\n    ... on SinglePlayerGameBet {\n      id\n      isWin\n      multiplier\n      profit\n      amount\n      details {\n        ... on TowerGameDetails {\n          __typename\n          difficulty\n          levels\n          levelsCount\n          uncovered\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on HiloGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on SinglePlayerGameBetInProgress {\n      _id\n      amount\n      details {\n        ... on TowerGameDetails {\n          __typename\n          difficulty\n          levels\n          levelsCount\n          uncovered\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on HiloGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}',
          variables: { tilesToUncover: data.tilesToUncover, _id: data.playId }
        },
        type: 'subscribe'
      })
    );
    step++;
  };

  const miniPlay = () => {
    step = 0;
    setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({
          id: '134fa1dd-86c9-4bd4-ae31-2b8d0db16d98',
          payload: {
            query:
              'mutation ($amount: Float!, $autoCashout: Boolean, $clientSeed: String!, $difficulty: TowerDifficulty!, $tilesToUncover: [Int!]) {\n  playTower(\n    amount: $amount\n    autoCashout: $autoCashout\n    clientSeed: $clientSeed\n    difficulty: $difficulty\n    tilesToUncover: $tilesToUncover\n  ) {\n    __typename\n    ... on SinglePlayerGameBet {\n      id\n      isWin\n      multiplier\n      profit\n      amount\n      details {\n        ... on TowerGameDetails {\n          __typename\n          difficulty\n          levels\n          levelsCount\n          uncovered\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on HiloGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on SinglePlayerGameBetInProgress {\n      _id\n      amount\n      details {\n        ... on TowerGameDetails {\n          __typename\n          difficulty\n          levels\n          levelsCount\n          uncovered\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on HiloGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}',
            variables: { difficulty: difficultyRef.current, amount: parseInt(amountRef.current), clientSeed: userIdRef.current }
          },
          type: 'subscribe'
        })
      );
    }, 500);
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
  const withdraw = (data) => {
    socketRef.current.send(
      JSON.stringify({
        id: '553d7226-9b85-11ee-8c90-0242ac120002',
        payload: {
          query:
            'mutation ($_id: ID!) {\n  towerCashout(_id: $_id) {\n    id\n    isWin\n    multiplier\n    profit\n    amount\n    details {\n      ... on TowerGameDetails {\n        __typename\n        difficulty\n        levels\n        levelsCount\n        uncovered\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on DiceGameDetails {\n        __typename\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on HiloGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
          variables: { _id: data.playId }
        },
        type: 'subscribe'
      })
    );
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
      if (response.id === '2302f5fa-98c0-11ee-b9d1-0242ac120002' && response.payload) {
        username = response.payload.data.authenticate.username;
        getbalence();
      } else if (response.id === '134fa1dd-86c9-4bd4-ae31-2b8d0db16d98' && response.payload) {
        if (response.payload.errors && response.payload.errors[0].message === 'INSUFFICIENT_FUNDS_ERROR')
          toast('Not enough BCH', { hideProgressBar: false, autoClose: 2000, type: 'error' });
        else if (response.payload.data) {
          playId = response.payload.data.playTower._id;
          let array = [0, 1, 2, 3];
          autoPlay({ playId: playId, tilesToUncover: [array[Math.floor(Math.random() * array.length)]] });
        }
      } else if (response.id === '9dafaba2-98c7-11ee-b9d1-0242ac120002' && response.payload) {
        if (response.payload.data.towerSelectTiles.__typename === 'SinglePlayerGameBet') {
          setPlayData((prevPlayData) => [...prevPlayData, { username: username, data: response.payload.data.towerSelectTiles }]);
          if (counter < playNumberRef.current) {
            counter++;
            miniPlay();
          }
        } else if (response.payload.data.towerSelectTiles.__typename === 'SinglePlayerGameBetInProgress') {
          let array = [0, 1, 2, 3];
          if (step < stepLimitRef.current) {
            autoPlay({ playId: playId, tilesToUncover: [array[Math.floor(Math.random() * array.length)]] });
          } else {
            withdraw({ playId: playId });
          }
        }
      } else if (response.id == 'f454cbb6-d074-470d-9aa4-835dc10904a4') {
        if (response.payload.data.balance) {
          setBalance(response.payload.data.balance.after);
        }
      } else if (response.id == '553d7226-9b85-11ee-8c90-0242ac120002' && response.payload) {
        setPlayData((prevPlayData) => [...prevPlayData, { username: username, data: response.payload.data.towerCashout }]);
        miniPlay();
      } else {
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

  useEffect(() => {
    playNumberRef.current = playNumber;
    userIdRef.current = user.userId;
    amountRef.current = amount;
    balanceRef.current = balance;
    stepLimitRef.current = stepLimit;
    difficultyRef.current = difficulty;
  }, [playNumber, amount, balance, stepLimit, difficulty]);

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
        <div className="flex items-center mr-[58px]">
          <div className="text-[20px]">Step Limit</div>
        </div>
        <input
          className="items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100"
          onChange={handleChangeStepLimit}
        ></input>
      </div>

      <div className="inline-flex w-full mb-5">
        <button
          className={`rounded-full ${buttonColor1} hover:bg-gray-500 ml-3`}
          onClick={() => {
            handleChangeHard('Hard');
          }}
        >
          <div className="mx-[20px]">Hard</div>
        </button>
        <button
          className={`rounded-full ${buttonColor2} hover:bg-gray-500 ml-3`}
          onClick={() => {
            handleChangeHard('Medium');
          }}
        >
          <div className="mx-[20px]">Medium</div>
        </button>
        <button
          className={`rounded-full ${buttonColor3} hover:bg-gray-500 ml-3`}
          onClick={() => {
            handleChangeHard('Easy');
          }}
        >
          <div className="mx-[20px]">Easy</div>
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
          <div className="table text-[15px] w-full">
            <div className="table-header-group">
              <div className="table-row">
                <div className="table-cell text-left">No</div>
                <div className="table-cell text-left">User</div>
                <div className="table-cell text-left">Amount</div>
                <div className="table-cell text-left">Id</div>
                <div className="table-cell text-left">Multiplier</div>
                <div className="table-cell text-left">Profit</div>
              </div>
            </div>

            <div className="table-row-group">
              {playData.map((item, index) => (
                <div className="table-row" key={index}>
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{item.username}</div>
                  <div className="table-cell">{item.data.amount}</div>
                  <div className="table-cell">{item.data.id}</div>
                  <div className="table-cell">{item.data.multiplier}</div>
                  <div className="table-cell">{item.data.profit}</div>
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

export default Tower;
