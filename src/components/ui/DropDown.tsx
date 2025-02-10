"use client";

import { useState } from "react";
import { auth, signOut } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user/user";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TextField } from "@mui/material";

export function UserDropdown({
  user,
  refreshUser,
}: {
  user: any;
  refreshUser: () => void;
}) {
  const [apiKey, setApiKey] = useState(user.openai_api_key || "");
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSaveApiKey = async () => {
    try {
      const valueToSend = apiKey.trim() === "" ? null : apiKey;
      await UserService.updateOpenaiApiKey(valueToSend);
      toast.success("API Key оновлено!");
      await refreshUser();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-#121212 text-white border  px-4 py-2 rounded-lg shadow-md  transition-all duration-300"
        >
          {user.email}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 bg-black border border-gray-600 shadow-lg rounded-lg"
      >
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-300 m-2">
            OpenAI API Key
          </h3>

          <TextField
            value={apiKey}
            placeholder="Your OpenAI API Key"
            hiddenLabel
            onChange={(e) => setApiKey(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
          />
          <Button
            className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg py-2 transition-all duration-300"
            onClick={handleSaveApiKey}
            variant="default"
          >
            Save
          </Button>

          <button
            onClick={handleLogout}
            className="mt-4 text-[14px] text-red-500 font-semibold border border-transparent bg-transparent hover:bg-#ff4d4d19 border-red-500 transition-all duration-300 px-4 py-2 rounded-lg cursor-pointer w-full"
          >
            Log out
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
