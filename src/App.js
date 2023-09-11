import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSplitBill(value) {
    setFriends((els) =>
      els.map((el) =>
        el.id === selectedFriend.id
          ? { ...el, balance: el.balance + value }
          : el
      )
    );
  }
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(null);
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          onSelection={handleSelection}
          friends={friends}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && (
          <FormAddFriend
            setFriends={setFriends}
            setShowAddFriend={setShowAddFriend}
          />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          setFriends={setFriends}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ onSelection, friends, selectedFriend }) {
  return (
    <ul>
      {friends.map((el) => (
        <Friend
          friends={el}
          key={el.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friends, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friends.id;
  return (
    <li className={isSelected && "selected"}>
      <img src={friends.image} alt="friend-profile"></img>
      <h3>{friends.name}</h3>
      {friends.balance < 0 && (
        <p className="red">
          You owe {friends.name} ${Math.abs(friends.balance)}.
        </p>
      )}
      {friends.balance > 0 && (
        <p className="green">
          {friends.name} owes you ${Math.abs(friends.balance)}.
        </p>
      )}
      {friends.balance === 0 && <p>You and {friends.name} are even.</p>}
      <Button onClick={() => onSelection(friends)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ setFriends, setShowAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriendObj = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setFriends((el) => [...el, newFriendObj]);
    setShowAddFriend(false);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }
  return (
    <div>
      <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
        <label>😍Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <label>🖼Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        ></input>

        <Button>Add</Button>
      </form>
    </div>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendExpenses = billValue && paidByUser ? billValue - paidByUser : 0;

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !paidByUser) {
      return;
    }
    onSplitBill(whoIsPaying === "user" ? friendExpenses : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      ></input>

      <label>🧑Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > billValue
              ? paidByUser
              : Number(e.target.value)
          )
        }
      ></input>

      <label>🐷{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpenses}></input>

      <label>😎Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
