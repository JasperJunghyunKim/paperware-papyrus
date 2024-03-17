import { ApiHook } from "@/common";
import { Button } from "@/components";
import { useIonRouter } from "@ionic/react";
import { useCallback, useState } from "react";

export default function Component() {
  const router = useIonRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const apiSignIn = ApiHook.Account.useSignIn();
  const cmdSignIn = useCallback(async () => {
    const response = await apiSignIn.mutateAsync({ username, password });
    router.push("/invoice");
  }, [apiSignIn, username, password]);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex-initial text-center text-4xl font-bold">
        PAPERWARE
      </div>
      <div className="flex-initial basis-1/2" />
      <div className="flex-initial flex flex-col items-center">
        <input
          className="w-64 h-12 border-2 border-gray-300 rounded-md px-4 py-2 mb-4"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-64 h-12 border-2 border-gray-300 rounded-md px-4 py-2 mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="로그인" onClick={cmdSignIn} />
      </div>
    </div>
  );
}
