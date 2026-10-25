import type { Dispatch } from "react";

import type { EditorAction, EditorState } from "@/lib/character-editor";

export type StepProps = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
};
