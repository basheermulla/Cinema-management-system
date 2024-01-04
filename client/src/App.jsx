import axios from "axios";
import { useEffect, useState } from "react";

const SERVER_URL = "http://localhost:8082/members";

function App() {
  const [members, setMembers] = useState([]);
  const getMembers = async () => {
    const resp = await axios.get(SERVER_URL);
    console.log(resp.data);
    setMembers(resp.data);
  }

  return (
    <>
      <h1>Start Implement the client side on my system</h1>
      <h3> Create POC - a connection between the "Client" and both "Cinema" server and "Subscriptions" server </h3>
      <button onClick={getMembers}>Get Members</button>
      <ul>
        {members?.map((member, index) => {
          return (
            <div key={index}>
              <li>{member.name}</li>
              <li>{member.email}</li>
              <li>{member.city}</li>
              <img src={member.image} width="80" />
            </div>
          )
        })
        }
      </ul>
    </>
  )
}

export default App
