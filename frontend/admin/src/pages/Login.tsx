import { Button, Stack, TextInput, Title } from "@mantine/core";
import React, { useContext } from "react";
import { AuthService } from "../core/services/AuthService";
import { Notifications } from "@mantine/notifications";
import { AppContext } from "../App";

export function LoginPage() {
  const { login } = useContext(AppContext);

  async function OnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username: { value: username }, password: { value: password} } = event.currentTarget;

    try {
      const req = await AuthService.Login(username, password);
      login(req.access_token);
    } catch {
      Notifications.show({
        title: "Login failed!",
        message: "An error occured, please check your credentials.",
        color: 'red'
      });
    }
  }

  return (
      <div className="flex flex-col">
        <Title className="text-center">Live Chat</Title>
        <span className="block text-center text-gray-400 text-sm">Please enter your credentials to start chating!</span>
        <form onSubmit={ OnSubmit } className="mt-4">
          <Stack gap="xs">
            <TextInput label="Username" aria-label="Username" name="username" description="Use your genius#### id to login" required withAsterisk />
            <TextInput label="Password" aria-label="Password" name="password" type="password" required withAsterisk />
            <Button type="submit">Login</Button>
          </Stack>
        </form>
      </div>
  )
}