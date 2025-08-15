import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function fontAwesomeLibrary() {
  library.add(faXmark);

  return library;
}
