import Single from "../../components/single/Single"
import "./user.scss"
import { useParams } from "react-router-dom";
const User = () => {
  const { user_id } = useParams();
  //Fetch data and send to Single Component
  
  return (
    <div className="user">
      <Single userId={user_id} />
    </div>
  )
}

export default User