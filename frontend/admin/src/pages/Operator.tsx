import { UserActionMenu } from "../components/UserActionMenu";

export function OperatorPage() {
  return (
    <section className="w-full h-full flex flex-row items-start">
      <aside className="border-r border-gray-100 w-96 h-full">
        <div className="h-16 p-2 border-b border-gray-100 flex items-center">
          <span className="text-xl font-semibold">Conversations</span>
        </div>
      </aside>
      <nav className="w-full h-16 p-2 border-b border-gray-100 flex items-center justify-end">
        <UserActionMenu />
      </nav>
    </section>
  )
}