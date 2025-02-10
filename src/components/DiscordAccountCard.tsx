// DiscordAccountCard.tsx
import React, { useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardActions,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DiscordAccountService } from "@/services/discordAccounts/discordAccounts";

export interface DiscordAccount {
  id: string;
  name: string;
  accountToken: string;
}

interface DiscordAccountCardProps {
  account: DiscordAccount;
  refreshAccounts: () => void;
}

export const DiscordAccountCard: React.FC<DiscordAccountCardProps> = ({
  account,
  refreshAccounts,
}) => {
  // Стан для керування відкриттям модалок
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Локальні стани для форми редагування (окремі від відображуваних даних)
  const [editedName, setEditedName] = useState(account.name);
  const [editedAccountToken, setEditedAccountToken] = useState(
    account.accountToken
  );

  const router = useRouter();

  // При відкритті модалки редагування синхронізуємо локальні значення з поточними даними
  const handleOpenEditModal = () => {
    setEditedName(account.name);
    setEditedAccountToken(account.accountToken);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editedName.trim() || !editedAccountToken.trim()) {
      toast.error("Назва та токен обов'язкові!");
      return;
    }
    if (
      editedName === account.name &&
      editedAccountToken === account.accountToken
    ) {
      toast.info("Немає змін для збереження.");
      return;
    }
    setLoading(true);
    try {
      await DiscordAccountService.update(account.id, {
        name: editedName,
        accountToken: editedAccountToken,
      });
      toast.success("Акаунт оновлено!");
      refreshAccounts();
      setEditModalOpen(false);
    } catch {
      toast.error("Помилка оновлення акаунта");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await DiscordAccountService.delete(account.id);
      toast.success("Акаунт видалено!");
      refreshAccounts();
      setDeleteModalOpen(false);
    } catch {
      toast.error("Помилка видалення акаунта");
    } finally {
      setLoading(false);
    }
  };

  // Функція для переходу до чатів цього акаунта
  const handleGoToChats = () => {
    router.push(`/discord-accounts/${account.id}/chats`);
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" color="white">
                {account.name}
              </Typography>
            }
          />
          <CardActions>
            <IconButton
              onClick={handleOpenEditModal}
              color="primary"
              aria-label="редагувати акаунт"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => setDeleteModalOpen(true)}
              color="error"
              aria-label="видалити акаунт"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={handleGoToChats}
              color="info"
              aria-label="перейти до чатів"
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>

      {/* Модалка редагування */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            background: "#121212",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            textAlign: "center",
            pb: 0,
          }}
        >
          Edit Account
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Account Name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  backgroundColor: "#1f1f1f",
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              label="Discord Token"
              value={editedAccountToken}
              onChange={(e) => setEditedAccountToken(e.target.value)}
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setEditModalOpen(false)}
            sx={{
              color: "#ff4d4d",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                color: "#ff4d4d",
                backgroundColor: "rgba(255, 77, 77, 0.1)",
                borderColor: "#ff4d4d",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={
              loading ||
              !editedName.trim() ||
              !editedAccountToken.trim() ||
              (editedName === account.name &&
                editedAccountToken === account.accountToken)
            }
            sx={{
              color: "#a3d9a5",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                color: "#4caf50",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                borderColor: "#4caf50",
              },
              "&:disabled": {
                color: "#777",
                borderColor: "#555",
                backgroundColor: "transparent",
                cursor: "not-allowed",
                "&:hover": {
                  color: "#777",
                  backgroundColor: "transparent",
                  borderColor: "#4caf50",
                },
              },
            }}
          >
            {loading ? "Updating..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модалка підтвердження видалення */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-paper": {
            background: "#121212",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            textAlign: "center",
            pb: 0,
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              textAlign: "center",
              color: "#bbb",
              fontSize: "1rem",
              mt: 2,
            }}
          >
            Are you sure you want to delete the account{" "}
            <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>
              {account.name}
            </span>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            sx={{
              color: "#a3d9a5",
              border: "1px solid transparent",
              backgroundColor: "transparent",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                borderColor: "#a3d9a5",

                backgroundColor: "rgba(47, 144, 36, 0.2)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            disabled={loading}
            sx={{
              color: "#ff4d4d",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255, 77, 77, 0.2)",
                borderColor: "#ff4d4d",
              },
              "&:disabled": {
                color: "#777",
                borderColor: "#555",
                backgroundColor: "transparent",
                cursor: "not-allowed",
                "&:hover": {
                  color: "#777",
                  backgroundColor: "transparent",
                  borderColor: "#ff4d4d",
                },
              },
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
