"use client";

import { DiscordAccountService } from "@/services/discordAccounts/discordAccounts";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

export function AddDiscordAccountModal({
  onAccountAdded,
  user,
}: {
  onAccountAdded: () => void;
  user: any;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [accountToken, setAccountToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setName("");
    setAccountToken("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !accountToken.trim()) {
      toast.error("Назва та токен обов'язкові!");
      return;
    }
    setLoading(true);
    try {
      await DiscordAccountService.create({ name, accountToken });
      toast.success("Акаунт успішно додано!");
      onAccountAdded();
      handleClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip
        title={
          !user?.openai_api_key
            ? "You need to set your OpenAI API Key first"
            : ""
        }
        arrow
        PopperProps={{
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "window",
              },
            },
          ],
        }}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: "20px", // Зміни розмір шрифту тут
              backgroundColor: "#333", // Темний фон для кращої видимості
              color: "red", // Білий текст
              padding: "8px 12px", // Відступи для кращого вигляду
              borderRadius: "6px", // Закруглені краї
            },
          },
          arrow: {
            sx: {
              color: "#333", // Колір стрілки, щоб збігався з фоном
            },
          },
        }}
      >
        <span>
          <Button
            onClick={handleOpen}
            sx={{
              transition: "all 0.3s ease-in-out",
              border: "1px solid grey",
              color: "#fff",
              backgroundColor: "transparent",
              "&:hover": {
                background: !user?.openai_api_key
                  ? "transparent"
                  : "linear-gradient(135deg, #1e1e1e, #333)",
                color: !user?.openai_api_key ? "#fff" : "#a3d9a5",
                borderColor: !user?.openai_api_key ? "grey" : "#4caf50",
                transform: !user?.openai_api_key ? "none" : "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              "&:disabled": {
                color: "#777",
                borderColor: "grey",
                cursor: "not-allowed",
              },
            }}
            disabled={!user?.openai_api_key}
          >
            ADD ACCOUNT
          </Button>
        </span>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
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
          ADD ACCOUNT
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Name of the account"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <TextField
              label="Discord token of the account"
              value={accountToken}
              onChange={(e) => setAccountToken(e.target.value)}
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
            onClick={handleClose}
            sx={{
              color: "#ff4d4d",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                color: "#ff4d4d", // Red text on hover
                backgroundColor: "#ff4d4d19", // Light red background
                borderColor: "#ff4d4d", // Red border on hover
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !accountToken.trim()}
            sx={{
              color: "#a3d9a5", // Light green text
              backgroundColor: "transparent",
              border: "1px solid transparent",

              transition: "all 0.3s ease-in-out",
              "&:hover": {
                color: "#4caf50", // Darker green text on hover
                backgroundColor: "rgba(76, 175, 80, 0.1)", // Light green background
                borderColor: "#4caf50", // Green border on hover
              },
              "&:disabled": {
                color: "#777", // Gray text
                borderColor: "#555", // Dark gray border
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
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
