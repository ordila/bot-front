"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import ChatCard from "@/components/ChatCard";
import CreateChatModal from "@/components/CreateChatModal";
import EditChatModal from "@/components/EditChatModal";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserService } from "@/services/user/user";

export default function DiscordChatPage() {
  // Отримуємо discordAccountId із параметрів маршруту
  const { id: discordAccountId } = useParams();
  const router = useRouter();

  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);

  // Перевірка авторизації користувача
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        try {
          const { user } = await UserService.getUser();
          setUser(user);
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Функція для завантаження чатів
  const fetchChats = useCallback(async () => {
    if (!discordAccountId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/discord-accounts/${discordAccountId}/chats`
      );
      setChats(response.data);
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      toast.error("Не вдалося завантажити чати");
    } finally {
      setLoading(false);
    }
  }, [discordAccountId]);

  // Викликаємо fetchChats, коли є discordAccountId та user
  useEffect(() => {
    if (discordAccountId && user) {
      fetchChats();
    }
  }, [discordAccountId, user, fetchChats]);

  const handleCreateChat = () => {
    setCreateModalOpen(true);
  };

  const handleEditChat = (chat: any) => {
    setSelectedChat(chat);
    setEditModalOpen(true);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await axiosInstance.delete(
        `/discord-accounts/${discordAccountId}/chats/${chatId}`
      );
      toast.success("Чат видалено!");
      fetchChats();
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      toast.error("Помилка видалення чату");
    }
  };

  // Якщо користувач або discordAccountId ще не завантажилися, показуємо спінер
  if (!user || !discordAccountId) {
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
        paddingBlock: 16,
        paddingInline: 16,
        background: "linear-gradient(135deg, #121212, #000)",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 24, left: 24 }}>
        <Link
          href="/accounts"
          className="absolute top-6 left-6 text-white text-lg flex items-center gap-2 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
      </Box>
      <Typography variant="h4" gutterBottom align="center" color="white">
        Accounts chats
      </Typography>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleCreateChat}
          sx={{
            transition: "all 0.3s ease-in-out",
            border: "1px solid grey",
            color: "#fff",
            backgroundColor: "transparent",
            "&:hover": {
              background: "linear-gradient(135deg, #1e1e1e, #333)",
              color: "#a3d9a5",
              borderColor: "#4caf50",
              transform: "scale(1.05)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          Add chat
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : chats.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          There are no chats yet
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {chats.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              onEdit={() => handleEditChat(chat)}
              onDelete={() => handleDeleteChat(chat.id)}
            />
          ))}
        </Grid>
      )}

      <CreateChatModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        discordAccountId={discordAccountId as string}
        onChatCreated={fetchChats}
        user={user}
      />

      {selectedChat && (
        <EditChatModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedChat(null);
          }}
          chat={selectedChat}
          discordAccountId={discordAccountId as string}
          onChatUpdated={fetchChats}
          user={user}
        />
      )}
    </div>
  );
}
