// components/ChatCard.tsx
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
  Button,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

interface ChatCardProps {
  chat: any;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export default function ChatCard({ chat, onEdit, onDelete }: ChatCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(chat.status || "stopped");

  const handleDeleteConfirmation = async () => {
    setLoading(true);
    try {
      await onDelete(); // Викликаємо callback видалення з батьківського компонента
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (event: SelectChangeEvent<any>) => {
    const newStatus = event.target.value as string;
    setStatus(newStatus);

    try {
      await axiosInstance.patch(
        `/discord-accounts/${chat.discordAccountId}/chats/${chat.id}`,
        {
          status: newStatus,
        }
      );
      toast.success("Статус чату оновлено!");
    } catch {
      toast.error("Помилка оновлення статусу!");
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" color="white">
              {chat.name}
            </Typography>
          }
        />
        <CardActions>
          <FormControl
            fullWidth
            size="small"
            sx={{
              backgroundColor: "#1f1f1f",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#777",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                },
              },
            }}
          >
            <Select
              value={status}
              onChange={handleStatusChange}
              sx={{
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#444",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1f1f1f", // Темний фон списку
                    color: "#fff", // Білий текст
                    "& .MuiMenuItem-root": {
                      color: "#fff", // Колір тексту
                      "&:hover": { backgroundColor: "#333" }, // При наведенні
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#4caf50 !important", // Зелений фон вибраного
                      color: "#fff", // Білий текст вибраного елемента
                      "&:hover": { backgroundColor: "#388e3c !important" }, // Темніший зелений при наведенні
                    },
                  },
                },
              }}
            >
              <MenuItem
                value="active"
                sx={{
                  color: "#fff",
                  backgroundColor: "#1f1f1f",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Running
              </MenuItem>
              <MenuItem
                value="stopped"
                sx={{
                  color: "#fff",
                  backgroundColor: "#1f1f1f",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Stop
              </MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={onEdit}
            color="primary"
            aria-label="редагувати чат"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => setDeleteModalOpen(true)}
            color="error"
            aria-label="видалити чат"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

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
            Are you sure you want to delete the chat{" "}
            <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>
              {chat.name}
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
            onClick={handleDeleteConfirmation}
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
    </Grid>
  );
}
