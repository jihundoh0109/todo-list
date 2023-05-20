import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../util/auth";
import useFetch from "../../hooks/useFetch";
import Button from "../common/Button";

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const id = useSelector((state) => state.userData.id);
  const firstname = useSelector((state) => state.userData.firstname);
  const lastname = useSelector((state) => state.userData.lastname);
  const fullname = `${firstname} ${lastname}`;

  const token = useSelector((state) => state.auth.token);

  const { isLoading, fetchData } = useFetch();

  const redirectAfterDelete = () => {
    logout(dispatch, navigate);
  };

  const handleDeleteAccount = () => {
    const requestConfig = {
      url: "/api/user/" + id,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    fetchData(requestConfig, redirectAfterDelete);
  };

  return (
    <>
      <h1 className="text-2xl font-medium">Delete Account</h1>
      <p className="pt-7 pb-8">
        Hello <h3 className="font-bold inline">{fullname}</h3>
        !
        <br />
        <br />
        We are sorry to hear that you would like to delete your account. Please
        confirm below to make sure this is the action you want to take.
      </p>
      <div>
        <Button
          text="Confirm"
          onClick={handleDeleteAccount}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
