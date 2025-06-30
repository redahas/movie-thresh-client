import { Settings, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { UserProfile } from "~/types/base"

// {user.avatar_url && (
//                   <img 
//                     src={user.avatar_url} 
//                     alt="Avatar" 
//                     className="w-6 h-6 rounded-full"
//                   />
//                 )}
//                 <span className="mr-2">
//                   {user.full_name || user.email}
//                 </span>
//                 <Link to="/logout">Logout</Link>

export function AuthMenu({ user }: { user: UserProfile }) {
  const initials = user?.full_name?.split(' ').reduce((acc: string, curr: string) => acc + curr[0], '') ?? '';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.avatar_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <div >
              <h4 className="text-sm leading-none font-medium">{user?.full_name}</h4>
              <p className="text-muted-foreground text-sm">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
          <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex justify-between">
            Settings
            <Settings className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between">
            Logout
            <LogOut className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}