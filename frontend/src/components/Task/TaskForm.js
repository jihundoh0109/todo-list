import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useMutateData } from "../../hooks/useDataOperations";
import {
  taskDeadlineValidator,
  taskDescriptionValidator,
  taskNameValidator,
} from "../../util/validator";
import { formatDateISO, onSuccessAfterCreateOrEditData } from "../../util/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TaskModalTitle from "./TaskModalTitle";
import FormInput from "../common/FormInput";
import ButtonSubmit from "../common/Button/ButtonSubmit";
import ButtonCloseModal from "../common/Button/ButtonCloseModal";
import Modal from "../common/Modal";

const taskInputs = [
  {
    label: "Name",
    name: "name",
    type: "text",
    id: "name",
  },
  {
    label: "Deadline",
    name: "deadline",
    type: "datetime-local",
    id: "deadline",
  },
  {
    label: "Status",
    name: "status",
    type: "select",
    id: "status",
  },
  {
    label: "Description (optional)",
    name: "description",
    type: "textarea",
    id: "description",
  },
];

export default function TaskForm() {
  const token = useSelector((state) => state.auth.token);
  const taskToBeEdited = useSelector((state) => state.taskForm.itemToBeEdited);
  const isCreatingNew = taskToBeEdited.id === -1;
  const projectId = useParams().projectId;

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const requestConfig = {
    url: isCreatingNew
      ? `/api/${projectId}/tasks`
      : `/api/tasks/${taskToBeEdited.id}`,
    method: isCreatingNew ? "POST" : "PATCH",
    token: token,
  };

  const { mutate: createOrEditTask, isLoading } = useMutateData(
    requestConfig,
    onSuccessAfterCreateOrEditData(
      queryClient,
      ["tasks", projectId],
      (data) => ({
        id: data.task.task_id,
        name: data.task.task_name,
        deadline: data.task.task_deadline,
        status: data.task.task_status,
        description: data.task.task_description,
        isDone: data.task.task_status === "Finished",
      }),
      isCreatingNew,
      dispatch,
      "task"
    )
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: isCreatingNew ? "" : taskToBeEdited.name,
      deadline: isCreatingNew ? "" : formatDateISO(taskToBeEdited.deadline),
      description: isCreatingNew ? "" : taskToBeEdited.description,
      status: isCreatingNew ? "Not started" : taskToBeEdited.status,
    },
    resolver: yupResolver(
      yup.object({
        name: taskNameValidator,
        deadline: taskDeadlineValidator,
        description: taskDescriptionValidator,
      })
    ),
    mode: "onChange",
  });
  
  return (
    <Modal>
      <form
        className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
        onSubmit={handleSubmit((data) => createOrEditTask(data))}
      >
        <TaskModalTitle isCreatingNew={isCreatingNew} />
        {taskInputs.map(({ id, name, type, label }) => (
          <FormInput
            key={id}
            id={id}
            name={name}
            type={type}
            label={label}
            errors={errors}
            register={register}
          />
        ))}
        <div className="w-full">
          {isCreatingNew ? (
            <ButtonSubmit
              text={isLoading ? "Creating" : "Create task"}
              disabled={isLoading || !isValid}
            />
          ) : (
            <ButtonSubmit
              text={isLoading ? "Editing" : "Edit task"}
              disabled={isLoading || !isValid}
            />
          )}
          <ButtonCloseModal
            disabled={isLoading}
            formResetRequired={{ required: !isCreatingNew, for: "task" }}
          />
        </div>
      </form>
    </Modal>
  );
}
