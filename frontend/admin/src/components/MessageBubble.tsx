import { ClassNames } from "../core/functions/ClassNames";
import { Message } from "../core/types/Message";

type Props = {
  message: Message;
  className?: string;
}

export function MessageBubble(props: Props) {
  return (
    <div
      className={
        ClassNames(
          props.className,
          "text-sm font-medium p-2 rounded-lg max-w-96 text-left"
        )
      }
    >
      { props.message.text }
    </div>
  );
};