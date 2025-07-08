import { Popcorn } from "lucide-react";
import { MovieSearch } from "~/components/MovieSearch";
import { AuthMenu } from "~/components/AuthMenu";
import { SettingsMenu } from "~/components/SettingsMenu";
import { Link } from "@tanstack/react-router";
import { useUser } from "~/hooks/useUser";
import { useRef } from "react";

export function StickyHeader() {
  const { user } = useUser();
  const settingsRef = useRef<{ setIsOpen: (open: boolean) => void }>(null);
  console.log("user", user);

  const handleOpenSettings = () => {
    settingsRef.current?.setIsOpen(true);
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="container flex h-16 items-center space-x-4 justify-between  mx-auto">
        <div className="p-2 flex gap-2 text-lg">
          <Link to="/">
            <Popcorn size={32} />
          </Link>
        </div>
        <MovieSearch />
        <div className="p-2 flex gap-2 text-lg">
          <div className="ml-auto flex items-center gap-2">
            <SettingsMenu ref={settingsRef} />
            {user ? (
              <AuthMenu user={user} onOpenSettings={handleOpenSettings} />
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
