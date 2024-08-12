import { checkUser } from "../../auth/_actions/isAuthenticated";
import BottomNavLinks from "./BottomNavLinks";

export default async function BottomNavbar() {
  const user = await checkUser();

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-14 w-full max-w-lg -translate-x-1/2 border border-slate-300 bg-slate-200 text-slate-400">
      <BottomNavLinks user={user} cart={null} />
    </div>
  );
}
