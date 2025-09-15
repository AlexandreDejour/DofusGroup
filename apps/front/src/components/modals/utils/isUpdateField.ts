import { ModalType } from "../../../contexts/modalContext";
import { UpdateForm } from "../../../types/form";

export default function isUpdateField(
  field: ModalType,
): field is keyof UpdateForm {
  return field === "mail" || field === "password" || field === "username";
}
