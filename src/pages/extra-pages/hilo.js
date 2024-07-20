import React, { useState, useEffect, useRef } from 'react';
import useAuth from 'hooks/useAuth';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Hilo = () => {
  const [amount, setAmount] = useState(0);
  const [playNumber, setPlayNumber] = useState(1);
  const socketRef = useRef(null);
  const [playData, setPlayData] = useState([]);
  let username = '';
  let playId = '';
  let counter = 0;
  let selectArray = ['HigherOrSame', 'LowerOrSame'];
  const playNumberRef = useRef(1);
  const userIdRef = useRef('');
  const amountRef = useRef(0);
  const { user } = useAuth();
  const userToken = user.authToken;
  const [balance, setBalance] = useState(0);
  const balanceRef = useRef(0);

  function handleChangeAmount(event) {
    setAmount(event.target.value);
  }
  function handleChangePlayNumber(event) {
    setPlayNumber(parseInt(event.target.value));
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
                  'mutation ($amount: Float!, $card: String!, $clientSeed: String!) {\n  playHilo(amount: $amount, card: $card, clientSeed: $clientSeed) {\n    _id\n    amount\n    details {\n      ... on HiloGameDetails {\n        __typename\n        cards\n        picks\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on DiceGameDetails {\n        __typename\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on TowerGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
                variables: { card: '♦K', amount: parseInt(amount), clientSeed: userIdRef.current }
              },
              type: 'subscribe'
            })
          );
        }, 2000);
      }
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

  const autoPlay = (data) => {
    socketRef.current.send(
      JSON.stringify({
        id: '9dafaba2-98c7-11ee-b9d1-0242ac120002',
        payload: {
          query:
            'mutation ($_id: ID!, $pick: HiloGamePick!) {\n  hiloPick(_id: $_id, pick: $pick) {\n    __typename\n    ... on SinglePlayerGameBet {\n      id\n      isWin\n      multiplier\n      profit\n      amount\n      details {\n        ... on HiloGameDetails {\n          __typename\n          cards\n          picks\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on TowerGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on SinglePlayerGameBetInProgress {\n      _id\n      amount\n      details {\n        ... on HiloGameDetails {\n          __typename\n          cards\n          picks\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on TowerGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}',
          variables: { pick: data.pick, _id: data.playId }
        },
        type: 'subscribe'
      })
    );
  };

  const miniPlay = () => {
    setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({
          id: '134fa1dd-86c9-4bd4-ae31-2b8d0db16d98',
          payload: {
            query:
              'mutation ($amount: Float!, $card: String!, $clientSeed: String!) {\n  playHilo(amount: $amount, card: $card, clientSeed: $clientSeed) {\n    _id\n    amount\n    details {\n      ... on HiloGameDetails {\n        __typename\n        cards\n        picks\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on DiceGameDetails {\n        __typename\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on TowerGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
            variables: { card: '♦K', amount: parseInt(amountRef.current), clientSeed: userIdRef.current }
          },
          type: 'subscribe'
        })
      );
    }, 500);
  };
  const getString = (array) => {
    let string = '';
    for (let i = 0; i < array.length; i++) {
      string = string + array[i] + ',';
    }
    return string;
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
            playId = response.payload.data.playHilo._id;
            autoPlay({ playId: playId, pick: 'LowerOrSame' });
          }
        } else if (response.id === '9dafaba2-98c7-11ee-b9d1-0242ac120002' && response.payload) {
          if (response.payload.data.hiloPick.__typename === 'SinglePlayerGameBet') {
            setPlayData((prevPlayData) => [...prevPlayData, { username: username, data: response.payload.data.hiloPick }]);
            if (counter < playNumberRef.current) {
              counter++;
              miniPlay();
            }
          } else if (response.payload.data.hiloPick.__typename === 'SinglePlayerGameBetInProgress') {
            console.log('response.payload.data.hiloPick.__typename------->', response.payload);
            autoPlay({ playId: playId, pick: selectArray[Math.floor(Math.random() * 2)] });
          }
        } else if (response.id == 'f454cbb6-d074-470d-9aa4-835dc10904a4') {
          if (response.payload.data.balance) {
            setBalance(response.payload.data.balance.after);
          }
        } else {
          console.log('response =>', response);
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
  }, [playNumber, amount, balance]);

  return (
    <div className="w-screen">
      <div className="inline-flex w-full mb-5">
        <div className="flex items-center mr-[74px]">
          <div className="text-[20px]">Amount</div>
        </div>
        <input
          className="items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100"
          onChange={handleChangeAmount}
        ></input>
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
                <div className="table-cell text-left">Cards</div>
                <div className="table-cell text-left">Picks</div>
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
                  <div className="table-cell">{getString(item.data.details.cards)}</div>
                  <div className="table-cell">{getString(item.data.details.picks)}</div>
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

export default Hilo;
