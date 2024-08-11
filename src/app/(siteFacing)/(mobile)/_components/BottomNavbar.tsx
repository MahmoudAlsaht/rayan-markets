import { checkUser } from "../../auth/_actions/isAuthenticated";
import BottomNavLinks from "./BottomNavLinks";

export default async function BottomNavbar() {
  const user = await checkUser();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 h-16 w-full max-w-lg -translate-x-1/2 rounded-full border border-gray-100 bg-rayanPrimary-dark text-white">
      <BottomNavLinks user={user} />
    </div>
  );
}
