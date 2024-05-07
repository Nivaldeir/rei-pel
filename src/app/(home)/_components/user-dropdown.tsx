import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LockIcon, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

export function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="relative h-8 flex items-center w-full !px-0 space-x-2 justify-between hover:bg-transparent"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>{"U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 space-y-1 text-left"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LockIcon className="w-3 h-3 mr-3" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
