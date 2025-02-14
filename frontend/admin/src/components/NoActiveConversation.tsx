export function NoActiveConversation() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-full select-none">
      <p className="text-2xl uppercase font-bold text-gray-300">No active conversation</p>
      <p className="text-sm font-medium text-gray-200">Please select a converssation on the left sidebar.</p>
    </div>
  );
};