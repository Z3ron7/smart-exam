import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.scss";
import { useParams } from "react-router-dom";

const Single = () => {
  const { user_id } = useParams(); // Retrieve the user ID from the route

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data based on the user ID
    async function fetchUserData() {
      try {
        const response = await axios.get(`http://localhost:3001/users/users/${user_id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [user_id]);

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {userData && userData.image && <img src={userData.image} alt="" />}
            <h1>{userData ? userData.name : ''}</h1>
            <button>Update</button>
          </div>
          <div className="details">
        {userData && (
          <div className="item">
            <span className="itemTitle">Name</span>
            <span className="itemValue">{userData.name}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle">Username</span>
            <span className="itemValue">{userData.username}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle">Status</span>
            <span className="itemValue">{userData.status}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle">Verified</span>
            <span className="itemValue">{userData.isVerified ? 'Yes' : 'No'}</span>
          </div>
        )}
      </div>
        </div>
        <hr />
        {props.chart && (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={props.chart.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.chart.dataKeys.map((dataKey) => (
                  <Line
                    type="monotone"
                    dataKey={dataKey.name}
                    stroke={dataKey.color}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="activities">
        <h2>Latest Activities</h2>
        {props.activities && (
          <ul>
            {props.activities.map((activity) => (
              <li key={activity.text}>
                <div>
                  <p>{activity.text}</p>
                  <time>{activity.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


export default Single;