import { useMutateData } from "../hooks/useDataOperations";
import { onErrorAfterSubmit } from "../util/form";
import { emailValidator } from "../util/validator";
import useStatus from "../hooks/useStatus";
import AuthNavigation from "../components/Auth/AuthNavigation";
import AuthFormTitle from "../components/Auth/form/AuthFormTitle";
import AuthForm from "../components/Auth/form/AuthForm";

const forgotPasswordInput = [
  {
    name: "email",
    type: "text",
    placeholder: "Email",
    id: "email",
  },
];

export default function ForgotPassword() {
  const { status, setStatus } = useStatus();

  const requestConfig = {
    url: "/api/forgot_password",
    method: "POST",
  };

  const { mutate: onSendEmail, isLoading } = useMutateData(requestConfig, {
    onSuccess: () =>
      setStatus({ error: false, message: "Email successfully sent!" }),
    onError: (error) => onErrorAfterSubmit(error, setStatus),
  });

  const schemaObj = {
    email: emailValidator,
  };

  return (
    <div className="m-auto text-center py-10">
      <div className="mx-auto flex flex-col gap-5 w-80">
        <AuthFormTitle title="Forgot Password" />
        <AuthForm
          submit={onSendEmail}
          formInputs={forgotPasswordInput}
          status={status}
          isLoading={isLoading}
          additionalAction={
            <AuthNavigation
              action="Back to login"
              link="/login"
              isLoading={isLoading}
            />
          }
          btnTxt="Submit"
          btnDisabledTxt="Submitting"
          schemaObj={schemaObj}
        />
      </div>
    </div>
  );
}
