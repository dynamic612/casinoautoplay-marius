import useAuth from 'hooks/useAuth';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Dice = () => {
  const [amount, setAmount] = useState(0);
  const [receiverNumber, setReceiverNumber] = useState(1);
  const socketRef = useRef(null);
  const userIdRef = useRef('');
  const amountRef = useRef(0);
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const balanceRef = useRef(0);
  const userTokenRef = useRef('');
  const receiverNumberRef = useRef(0);
  useEffect(() => {
    userIdRef.current = user.userId;
    amountRef.current = amount;
    balanceRef.current = balance;
    userTokenRef.current = user.authToken;
    receiverNumberRef.current = receiverNumber;
  }, [receiverNumber, amount, balance]);
  function handleChangeAmount(event) {
    setAmount(event.target.value);
  }
  function handleChangeReceiverNumber(event) {
    setReceiverNumber(parseInt(event.target.value));
  }
  const send = async () => {
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
              'mutation ($amount: Float!, $recipientsCount: Int!) {\n  transferToRandomRecipients(amount: $amount, recipientsCount: $recipientsCount) {\n    amount\n    created_at\n    __typename\n  }\n}',
            variables: {
              amount: parseInt(amountRef.current),
              recipientsCount: receiverNumberRef.current
            }
          },
          type: 'subscribe'
        })
      );
    }, 2000);
  };

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
        console.log('response ------>', response);
        if (response.id === 'b37aeb93-b24a-41c4-8ac6-c8a496d99f88' && response.payload) {
          if (response.payload.errors && response.payload.errors[0].message === 'INSUFFICIENT_FUNDS_ERROR')
            toast('Not enough BCH', { hideProgressBar: false, autoClose: 2000, type: 'error' });
          else if (response.payload.errors && response.payload.errors[0].message === 'TRANSFER_AMOUNT_TOO_SMALL_ERROR') {
            toast('TRANSFER AMOUNT TOO SMALL ERROR', { hideProgressBar: false, autoClose: 2000, type: 'error' });
          } else if (response.payload.data.playDice) {
            toast('Success', { hideProgressBar: false, autoClose: 2000, type: 'success' });
          }
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
        <div className="flex items-center mr-[28px]">
          <div className="text-[20px]">Receiver Number</div>
        </div>
        <input
          className="items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100"
          onChange={handleChangeReceiverNumber}
        ></input>
        <button
          className={`rounded-full bg-gray-300 hover:bg-gray-500 ml-3`}
          onClick={() => {
            send();
          }}
        >
          <div className="mx-[20px]">Send</div>
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dice;
