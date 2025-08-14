import { AuthState, useTurnkey } from "@turnkey/react-wallet-kit";
import { TurnkeySVG } from "./Svg";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { logout, authState, handleLogin } = useTurnkey();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between w-full h-20 px-6 absolute top-0 z-50">
      <TurnkeySVG className="w-32 h-full" />
      {authState === AuthState.Authenticated && (
        <button onClick={handleLogout} className={`border-2 active:scale-95 py-1 px-4 rounded-full hover:cursor-pointer transition-all border-primary-dark  shadow-primary-dark hover:shadow`}>
          Logout
        </button>
      )}
    </nav>
  );
}