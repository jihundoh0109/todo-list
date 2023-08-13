import { useNavigate } from "react-router-dom";
import {
  emailValidator,
  firstnameValidator,
  lastnameValidator,
  passwordConfirmValidator,
  passwordNewValidator,
} from "../util/validator";
import { useMutateData } from "../hooks/useDataOperations";
import * as yup from "yup";
import useStatus from "../hooks/useStatus";
import AccountCTA from "../components/Auth/AccountCTA";
import AuthNavigation from "../components/Auth/AuthNavigation";
import AuthFormTitle from "../components/Auth/form/AuthFormTitle";
import AuthForm from "../components/Auth/form/AuthForm";
import { onErrorAfterSubmit } from "../util/form";

const signupInputs = [
  {
    name: "firstname",
    type: "text",
    placeholder: "First name",
    id: "firstname",
  },
  {
    name: "lastname",
    type: "text",
    placeholder: "Last name",
    id: "lastname",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Email",
    id: "email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    id: "password",
  },
  {
    name: "passwordConfirm",
    type: "password",
    placeholder: "Verify password",
    id: "password-confirm",
  },
];

export default function Signup() {
  const navigate = useNavigate();

  const { status, setStatus } = useStatus();

  const requestConfig = {
    url: "/api/signup",
    method: "POST",
  };

  const { mutate: onSignup, isLoading } = useMutateData(requestConfig, {
    onSuccess: () => navigate("/login"),
    onError: (error) => onErrorAfterSubmit(error, setStatus),
  });

  const schemaObj = {
    firstname: firstnameValidator,
    lastname: lastnameValidator,
    email: emailValidator,
    password: passwordNewValidator,
    passwordConfirm: passwordConfirmValidator([yup.ref("password"), "", null]),
  };

  return (
    <div className="m-auto text-center py-10">
      <div className="mx-auto flex flex-col gap-5 w-80">
        <AuthFormTitle title="Sign Up" />
        <AuthForm
          submit={onSignup}
          formInputs={signupInputs}
          status={status}
          isLoading={isLoading}
          additionalAction={
            <AuthNavigation
              action="Back to login"
              link="/login"
              isLoading={isLoading}
            />
          }
          btnTxt="Sign Up"
          btnDisabledTxt="Signing In"
          schemaObj={schemaObj}
        />
        <AccountCTA action="Log in" disabled={isLoading} />
      </div>
    </div>
  );
}
