// Accounts.tsx
"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Firebase та сервіси (припускаємо, що вони у вас налаштовані)
import { auth } from "@/lib/firebase";
import { UserService } from "@/services/user/user";

// Material UI імпорти
import { Box, Grid, Typography, CircularProgress } from "@mui/material";

import { DiscordAccountService } from "@/services/discordAccounts/discordAccounts";
import { UserDropdown } from "@/components/ui/DropDown";
import { AddDiscordAccountModal } from "@/components/AddDiscordAccount";

import { DiscordAccountCard } from "@/components/DiscordAccountCard";

export default function Accounts() {
  const [user, setUser] = useState<User | null>(null);
  const [discordAccounts, setDiscordAccounts] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        try {
          const { user } = await UserService.getUser();
          setUser(user);

          const accounts = await DiscordAccountService.getAll();
          setDiscordAccounts(accounts);
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const refreshAccounts = async () => {
    try {
      const updatedAccounts = await DiscordAccountService.getAll();
      setDiscordAccounts(updatedAccounts);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const refreshUser = async () => {
    try {
      const { user: updatedUser } = await UserService.getUser();
      setUser(updatedUser);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBlock: 4,
        paddingInline: "16px",
        background: "linear-gradient(135deg, #121212, #000)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <UserDropdown user={user} refreshUser={refreshUser} />
      </Box>

      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <AddDiscordAccountModal onAccountAdded={refreshAccounts} user={user} />
      </Box>

      <Box sx={{ mt: 4 }}>
        {discordAccounts.length === 0 ? (
          <Typography variant="h6" align="center" color="white">
            No connected accounts
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {discordAccounts.map((account) => (
              <DiscordAccountCard
                account={account}
                key={account.id}
                refreshAccounts={refreshAccounts}
              />
            ))}
          </Grid>
        )}
      </Box>
    </div>
  );
}
