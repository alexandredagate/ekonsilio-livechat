import { useContext } from "react";
import { AppContext } from "../App";
import { Avatar, Indicator, Menu, UnstyledButton } from "@mantine/core";
import { ChevronDown, LogOut } from "lucide-react";

export function UserActionMenu() {
  const { user, logout } = useContext(AppContext);

  return (
    <Menu>
      <Menu.Target>
        <UnstyledButton className="flex flex-row items-center gap-2">
          <Indicator color="green" offset={ 4 } size={ 14 } position="bottom-end" inline withBorder>
            <Avatar>G</Avatar>
          </Indicator>
          <span className="text-sm font-semibold uppercase">{ user?.username }</span>
          <ChevronDown size={ 12 } />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item color="red" onClick={ logout } leftSection={ <LogOut size={ 12 } /> }>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};